<?php
namespace Resource;

require 'model/Notebook.php';
require 'model/Notebooks.php';

use \core\Message;
use \core\db\Collection;
use \core\db\Database;
use \core\db\CollectionParams;
use \core\Security;
use \core\Http;
use \core\Lang;

use \dao\Dao;

use \model\Notebook;
use \model\Notebooks;


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
        if($connection->dbPreparedStatement("select n.id, n.userId, n.name, n.creationDate, n.modifyDate, n.hash from notebooks n order by n.name asc" , null)){
            $records = $connection->getFetchData();
            foreach ($records as $record) {
                $notebook = $this->getNotebookRecord((int)$record["id"], (int)$record["userId"], $record["name"], $record["creationDate"], $record["modifyDate"]);
                array_push($result, $notebook);
            }
        }
        return $result;
    }

    private function getNotebookRecord(int $id, $userId, $name, $creationDate, $modifyDate) {
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

    public function postNotebook($parameters, $notebook) : Message {
        $input = new Notebook();
        $input->setUserId(Security::getUserId());
        
        $input->setName($notebook->name);

        $now = (new \DateTime())->format("Y-m-d H:i:s");
        $input->setCreationDate($now);
        $input->setModifyDate($now);
        $input->setHash("");

        $connection = Database::getInstance();
        $connection->dbConnect();
        $newId = $input->post($connection);
        if($newId !== false){
            
            $message = new \Core\Message(200, Lang::get("notebook_post_saved"));
            $message->addExtraInfo("id", $newId);
            return $message;
        } else {
            Http::setStatus(400);
            $message = new \Core\Message(400, Lang::get("generic_status_400"));
            $messages = $input->getMessages();
            if($messages){
                foreach($messages as $m){
                    $message->addExtraInfo($m->id, $m->faultcode);
                }
            }
            return $message;
        }
    }

    public function putNotebook($parameters, $notebook) {
        $input = new Notebook();
        $input->setId($notebook->id);
        $input->setUserId(Security::getUserId());
        $input->setName($notebook->name);
        
        $input->setCreationDate((new \DateTime($notebook->creationDate))->format("Y-m-d H:i:s"));
        $input->setModifyDate((new \DateTime($notebook->modifyDate))->format("Y-m-d H:i:s"));
        $input->setHash('');
        
        $connection = Database::getInstance();
        $connection->dbConnect();
        if($input->put($connection)){
            return new \Core\Message(200, Lang::get("notebook_put_saved"));
        } else {
            Http::setStatus(400);
            $message = new \Core\Message(400, Lang::get("generic_status_400"));
            $messages = $input->getMessages();
            if($messages){
                foreach($messages as $m){
                    $message->addExtraInfo($m->id, $m->faultcode);
                }
            }
            return $message;
        }
    }

    public function deleteNotebook($parameters) {
        $input = new Notebook();
        $input->setId($parameters[0]);
        $input->setUserId(Security::getUserId());
        
        $connection = Database::getInstance();
        $connection->dbConnect();
        
        $dao = new Dao();
        $chapters = $dao->getChaptersByNotebookId( $connection, $parameters[0], Security::getUserId());


        if($input->delete($connection)){
            return new \Core\Message(200, Lang::get("notebook_delete"));
        } else {
            Http::setStatus(400);
            $message = new \Core\Message(400, Lang::get("generic_status_400"));
            $messages = $input->getMessages();
            if($messages){
                foreach($messages as $m){
                    $message->addExtraInfo($m->id, $m->faultcode);
                }
            }
            return $message;
        }
    }
}