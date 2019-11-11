<?php
namespace Resource;

require 'model/Note.php';

use \core\Message;
use \core\Http;
use \core\Lang;
use \core\Security;
use \core\db\Database;
use \core\Formatter;

use \dao\Dao;

use \model\Note;

class NotesResource {
    function __construct(){
    }

    public function getNotes( array $parameters ) {
        if( $parameters!=null && count($parameters) == 2 ){
            $connection = Database::getInstance();
            $connection->dbConnect();
            
            return Dao::getNotesByChapterId($connection, $parameters[1], Security::getUserId());
        }
    }

    public function getNote( array $parameters )  {

        if( $parameters!=null && count($parameters) == 3 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            return $connection->getSingleItem(new Note(), "select * from notes where userId = ? and sectionId = ? and id = ?", 
            array(Security::getUserId(), $parameters[1], $parameters[2]));
        }
    }

    public function getNoteContent( array $parameters ) {
        if( $parameters!=null && count($parameters) == 3 ){
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($connection->dbPreparedStatement("select n.note from notes n where n.id = ? order by n.name asc" , array_slice($parameters,2))){
                $record = $connection->getFetchData();
                if(count($record)>0){
                    return $record[0]["note"];
                }
            }
        }
        Http::setStatus(404);
        throw new \Exception('Not found!');
    }

    public function putNoteContent($parameters, $content) : Message{
        if( $parameters!=null && count($parameters) == 3 ){

            $connection = Database::getInstance();
            $connection->dbConnect();
            
            $now = (new \DateTime())->format("Y-m-d H:i:s");

            if($connection->dbPreparedStatement("update notes set note = ?, modifyDate=? where userid = ? and sectionId = ? and id = ?", array(\json_encode($content), $now, Security::getUserId(), $parameters[1], $parameters[2]))) {
                $message = new \Core\Message(200, Lang::get("note_put_saved"));
                $message->addExtraInfo("modifyDate", $now);
                return $message;
            }
        }
        return $this->getFaultMessage(null);
    }

    public function putNote($parameters, $note){
        $input = new Note();
        if( $parameters != null && count($parameters) == 3 && $note->sectionId == $parameters[1] && $note->id == $parameters[2]) {
            $input->setId($note->id);
            $input->setSectionId($note->sectionId);
            $input->setUserId(Security::getUserId());
            $input->setName($note->name);
            $input->setCreationDate(Formatter::w3cToSqlDate($note->creationDate));
            $now = (new \DateTime())->format("Y-m-d H:i:s");
            $input->setModifyDate($now);
            $input->setHash('');
            
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($input->put($connection)){
                $message = new \Core\Message(200, Lang::get("note_put_saved"));
                $message->addExtraInfo("modifyDate", $now);
                return $message;
            }
        }
        
        $message = new \Core\Message(200, Lang::get("note_put_saved"));
         return $message;
        //return $this->getFaultMessage($input->getMessages());
    }

    public function postNote($parameters, $note){
        $input = new Note();
        if( $parameters!=null && count($parameters) == 2 ) {
            $input->setUserId(Security::getUserId());
            
            $input->setSectionId($parameters[1]);
            $input->setName($note->name);
            
            $now = (new \DateTime())->format("Y-m-d H:i:s");
            
            $input->setCreationDate($now);
            $input->setModifyDate($now);
            $input->setNote("");
            $input->setHash("");
            
            $connection = Database::getInstance();
            $connection->dbConnect();
            $newId = $input->post($connection);
            if($newId !== false){
              
                $message = new \Core\Message(200, Lang::get("note_post_saved"));
                $message->addExtraInfo("id", $newId);
                return $message;
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