<?php
namespace Resource;

require 'model/Note.php';

use \core\Message;
use \core\Http;
use \core\db\Database;

use \model\Note;

class NotesResource {
    function __construct(){
    }

    public function getNotes( array $parameters ) {
        if( $parameters!=null && count($parameters) == 2 ){

            $result=array();
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($connection->dbPreparedStatement("select n.id, n.sectionId, n.userId, n.name, n.creationDate, n.modifyDate, n.hash from notes n where n.sectionId = ? order by n.name asc" , array_slice($parameters,1))){
                $records = $connection->getFetchData();
                foreach ($records as $record) {
                    $note = new Note();
                    $note->setId((int)$record["id"]);
                    $note->setSectionId((int)$record["sectionId"]);
                    $note->setUserId((int)$record["userId"]);
                    $note->setName($record["name"]);
                    if($record["creationDate"]!=null && $record["creationDate"]!="") {
                        $note->setCreationDate((new \DateTime($record["creationDate"]))->format(\DateTime::W3C));
                    }
                    if($record["modifyDate"]!=null && $record["modifyDate"]!="") {
                        $note->setModifyDate((new \DateTime($record["modifyDate"]))->format(\DateTime::W3C));
                    }
                    array_push($result, $note);
                }
            }
            return $result;
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