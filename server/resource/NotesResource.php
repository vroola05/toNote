<?php
namespace Resource;

require 'model/Note.php';

use \core\Message;
use \core\Http;
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

    public function getNote( array $parameters ) : Note {
        if( $parameters!=null && count($parameters) == 3 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            $note = new Note();
            $note->setSectionId($parameters[1]);
            $note->setId($parameters[2]);
            $output = $note->get(array("id", "sectionId", "userId", "name", "creationDate", "modifyDate", "hash"), $connection);
            if($output !== false){
                return $output;
            }

            Http::setStatus(404);
            throw new \Exception('Not found!');
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

    public function putNote($parameters, $note) : Message{
        return new \Core\Message(200, "Note has been saved!");
    }

    public function postNote($parameters, $note){
        return new \Core\Message(200, "Note has been created!");
    }
}