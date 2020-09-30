<?php
namespace Resource;

require 'model/Notebook.php';

use \core\Message;
use \core\db\Database;
use \core\Security;
use \core\Http;
use \core\Lang;
use \core\Formatter;

use \dao\Dao;

use \model\Notebook;
use \model\Sort;

class NotebookResource {
    function __construct(){
    }

    public function getNotebooks(array $parameters = null) {
        if(!Security::hasAccess()){
            
            return new \Core\Message(401, Lang::get("generic_status_401"));
        }

        $result=array();
        $connection = Database::getInstance();
        $connection->dbConnect();
        
        $sort = Dao::getSortByUserIdAndName($connection, Security::getUserId(), "notebooks", "name");

        if($connection->dbPreparedStatement("select n.id, n.userId, n.name, n.creationDate, n.modifyDate, n.sort, n.hash from notebooks n order by ". $sort->identifier. " " .$sort->sort, null)){
            $records = $connection->getFetchData();
            foreach ($records as $record) {
                $notebook = $this->getNotebookRecord((int)$record["id"], (int)$record["userId"], $record["name"], $record["creationDate"], $record["modifyDate"], $record["sort"]);
                array_push($result, $notebook);
            }
        }
        return $result;
    }

    private function getNotebookRecord(int $id, $userId, $name, $creationDate, $modifyDate, $sort) {
        $notebook = new Notebook();
        $notebook->setId($id);
        $notebook->setUserId($userId);
        $notebook->setName($name);
        if($creationDate!=null && $creationDate!="") {
            $notebook->setCreationDate((new \DateTime($creationDate))->format(\DateTime::W3C));
        }
        if($modifyDate!=null && $modifyDate!="") {
            $notebook->setModifyDate((new \DateTime($modifyDate))->format(\DateTime::W3C));
        }
        $notebook->setSort($sort);
        return $notebook;
    }

    public function getNotebook( array $parameters ) : Notebook {
        if( count($parameters)>0 ){
            $connection = Database::getInstance();
            $connection->dbConnect();
            
            Http::setStatus(404);
            throw new \Exception(Lang::get("generic_status_404"));
        }
    }

    public function notebookSort(array $parameters): Message{
        if( $parameters!=null && count($parameters) == 2 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            Dao::resetNotebooksSortBy($connection, Security::getUserId());

            $notebookFrom = $connection->getSingleItem(new Notebook(), "select id, sort from notebooks where userId = ? and id = ?", 
            array(Security::getUserId(), $parameters[0]));

            $notebookTo = $connection->getSingleItem(new Notebook(), "select id, sort from notebooks where userId = ? and id = ?", 
            array(Security::getUserId(), $parameters[1]));

            if ($notebookFrom!=null && $notebookTo!=null) {
                Dao::updateNotebookSort($connection, $notebookFrom->getId(), Security::getUserId(), $notebookFrom->getSort(), $notebookTo->getSort());
            }

            $message = new \Core\Message(200, Lang::get("note_put_saved"));
            return $message;
        }
    }

    public function postNotebook($parameters, $notebook) : Message {
        $connection = Database::getInstance();
        $connection->dbConnect();

        $sort = Dao::getNotebookCount($connection, Security::getUserId());

        $input = new Notebook();
        $input->setUserId(Security::getUserId());
        
        $input->setName($notebook->name);

        $now = (new \DateTime())->format("Y-m-d H:i:s");
        $input->setCreationDate($now);
        $input->setModifyDate($now);
        $input->setSort($sort);
        $input->setHash("");

        $newId = $input->post($connection);
        if($newId !== false){
            $message = new \Core\Message(200, Lang::get("notebook_post_saved"));
            $message->addExtraInfo("id", $newId);
            return $message;
        }
        return $this->getFaultMessage($input->getMessages());
    }

    public function putNotebook($parameters, $notebook) {
        $input = new Notebook();
        $input->setId($notebook->id);
        $input->setUserId(Security::getUserId());
        $input->setName($notebook->name);
        
        $input->setCreationDate(Formatter::w3cToSqlDate($notebook->creationDate));
        $now = (new \DateTime())->format("Y-m-d H:i:s");
        $input->setModifyDate($now);
        $input->setHash('');
        
        $connection = Database::getInstance();
        $connection->dbConnect();
        if($input->put($connection)){
            return new \Core\Message(200, Lang::get("notebook_put_saved"));
        }
        return $this->getFaultMessage($input->getMessages());
    }

    public function deleteNotebook($parameters) {
        
        $connection = Database::getInstance();
        $connection->dbConnect();
        $chapters = Dao::getChaptersByNotebookId( $connection, $parameters[0], Security::getUserId() );
        foreach ($chapters as $chapter) {
            Dao::deleteNotes( $connection, $chapter->getId(), Security::getUserId() );
        }

        Dao::deleteChapters( $connection, $parameters[0], Security::getUserId() );

        $input = new Notebook();
        $input->setId($parameters[0]);
        $input->setUserId(Security::getUserId());
        if($input->delete($connection)){
            return new \Core\Message(200, Lang::get("notebook_delete"));
        }

        return $this->getFaultMessage($input->getMessages());
    }

    private function getFaultMessage(array $faults) {
        Http::setStatus(400);
        $message = new \Core\Message(400, Lang::get("generic_status_400"));
        if($faults){
            foreach($faults as $fault){
                $message->addExtraInfo($fault->id, $fault->faultcode);
            }
        }
        return $message;
    }
}