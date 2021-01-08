<?php
namespace Resource;

require 'model/Chapter.php';
require 'lists/Colors.php';

use \core\Message;
use \core\db\Database;
use \core\Security;
use \core\Http;
use \core\Lang;
use \core\Formatter;

use \dao\Dao;

use \lists\Colors;

use \model\Chapter;

class ChapterResource {
    function __construct(){
    }

    public function getChapters( array $parameters ) {
        if( $parameters!=null && count($parameters) == 1 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            return Dao::getChaptersByNotebookId( $connection, $parameters[0], Security::getUserId());
        }
    }

    public function getMoveChapterList( array $parameters ) {
        if( $parameters!=null && count($parameters) == 2 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            return Dao::getNotebooksWhereNotNotebookId( $connection, $parameters[0], Security::getUserId());
        }
    }
    

    public function getChapter( array $parameters ) : Chapter {
        if( $parameters!=null && count($parameters) == 2 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            $chapter = new Chapter();
            $chapter->setNotebookId($parameters[0]);
            $chapter->setUserId(Security::getUserId());
            $chapter->setId($parameters[1]);
            
            return $chapter->get(null, $connection);
        }
    }

    public function chapterSort(array $parameters): Message{
        
        if( $parameters!=null && count($parameters) == 3 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            Dao::resetChapterSortByNotebookId($connection, $parameters[0], Security::getUserId());

            $noteFrom = $connection->getSingleItem(new Chapter(), "select id, sort from chapters where userId = ? and notebookId = ? and id = ?", 
            array(Security::getUserId(), $parameters[0], $parameters[1]));

            $noteTo = $connection->getSingleItem(new Chapter(), "select id, sort from chapters where userId = ? and notebookId = ? and id = ?", 
            array(Security::getUserId(), $parameters[0], $parameters[2]));

            if ($noteFrom!=null && $noteTo!=null) {
                Dao::updateChapterSort($connection, $parameters[0], $noteFrom->getId(), Security::getUserId(), $noteFrom->getSort(), $noteTo->getSort());
            }

            $message = new \Core\Message(200, Lang::get("note_put_saved"));
            return $message;
        }
    }

    public function moveChapter( array $parameters ) : Message{
        if( $parameters!=null && count($parameters) == 3 ){

            $connection = Database::getInstance();
            $connection->dbConnect();

            $datetime = new \DateTime();
            
            $datetime->format(\DateTime::W3C);
            $now = $datetime->format("Y-m-d H:i:s");

            if($connection->dbPreparedStatement("update chapters set notebookId = ?, modifyDate=? where userid = ? and notebookId = ? and id = ?", array($parameters[2], $now, Security::getUserId(), $parameters[0], $parameters[1]))) {
                $message = new \Core\Message(200, Lang::get("chapter_put_saved"));
                $message->addExtraInfo("modifyDate", $datetime->format(\DateTime::W3C));
                return $message;
            }
        }
        return $this->getFaultMessage(null);
    }

    public function putChapter($parameters, $chapter) : Message{
        $input = new Chapter();
        if( $parameters!=null && count($parameters) == 2 && $chapter->notebookId == $parameters[0] && $chapter->id == $parameters[1]) {
            $input->setId($chapter->id);
            $input->setNotebookId($chapter->notebookId);
            $input->setUserId(Security::getUserId());
            $input->setName($chapter->name);
            $input->setColor($chapter->color);
            $input->setCreationDate(Formatter::w3cToSqlDate($chapter->creationDate));
            
            $datetime = new \DateTime();
            
            $datetime->format(\DateTime::W3C);
            $now = $datetime->format("Y-m-d H:i:s");
            $input->setModifyDate($now);

            $input->setSort($chapter->sort);
            $input->setHash('');
            
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($input->put($connection)){
                $message = new \Core\Message(200, Lang::get("chapter_put_saved"));
                $message->addExtraInfo("modifyDate", $datetime->format(\DateTime::W3C));
                return $message;
            }
        }
        
        return $this->getFaultMessage($input->getMessages());
    }

    public function postChapter($parameters, $chapter) {
        $input = new Chapter();
        if( $parameters!=null && count($parameters) == 1 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            $sort = Dao::getChapterCountByNotebookId($connection, $parameters[0], Security::getUserId());

            $input->setUserId(Security::getUserId());
            
            $input->setNotebookId($parameters[0]);
            $input->setName($chapter->name);
            
            $input->setColor(Colors::get()[mt_rand(0,count(Colors::get()))]);
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
        }
        return $this->getFaultMessage($input->getMessages());
    }

    public function deleteChapter($parameters) {
        $input = new Chapter();
        if($parameters != null && count($parameters) == 2) {
            $connection = Database::getInstance();
            $connection->dbConnect();
            
            Dao::deleteNotes( $connection, $parameters[1], Security::getUserId() );

            $input->setId($parameters[1]);
            $input->setNotebookId($parameters[0]);
            $input->setUserId(Security::getUserId());
            if($input->delete($connection)){
                return new \Core\Message(200, Lang::get("chapter_delete"));
            }
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