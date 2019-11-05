<?php
namespace Resource;

require 'model/Note.php';

use \core\Message;
use \core\Http;
use \core\Lang;
use \core\Security;
use \core\db\Database;

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
            
            //array("id", "sectionId", "userId", "name", "creationDate", "modifyDate", "hash")
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
        var_dump($parameters);
        var_dump($content);
        return new \Core\Message(200, "Note has been saved!");
    }

    public function putNote($parameters, $note) : Message{
        return new \Core\Message(200, "Note has been saved!");
    }

    public function postNote($parameters, $note){
        
        if( $parameters!=null && count($parameters) == 2 ){
            
            $input = new Note();
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
}