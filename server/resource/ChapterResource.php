<?php
namespace Resource;

require 'model/Chapter.php';

use \core\Message;
use \core\db\Database;

use \model\Chapter;

class ChapterResource {
    function __construct(){
    }

    public function getChapters( array $parameters ) {
        if( $parameters!=null && count($parameters) == 1 ){
            $result=array();
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($connection->dbPreparedStatement("select c.id, c.notebookId, c.userId, c.name, c.color, c.creationDate, c.modifyDate, c.hash from chapters c where c.notebookId = ? order by c.name asc" , $parameters)){
                $records = $connection->getFetchData();
                foreach ($records as $record) {
                    $chapter = new Chapter();
                    $chapter->setId((int)$record["id"]);
                    $chapter->setNotebookId((int)$record["notebookId"]);
                    $chapter->setUserId((int)$record["userId"]);
                    $chapter->setName($record["name"]);
                    $chapter->setColor($record["color"]);
                    if($record["creationDate"]!=null && $record["creationDate"]!="") {
                        $chapter->setCreationDate((new \DateTime($record["creationDate"]))->format(\DateTime::W3C));
                    }
                    if($record["modifyDate"]!=null && $record["modifyDate"]!="") {
                        $chapter->setModifyDate((new \DateTime($record["modifyDate"]))->format(\DateTime::W3C));
                    }
                    array_push($result, $chapter);
                }
            }
            return $result;
        }
    }

    public function getChapter( array $parameters ) : Chapter {
        if( $parameters!=null && count($parameters) == 2 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            $chapter = new Chapter();
            $chapter->setNotebookId($parameters[0]);
            $chapter->setId($parameters[1]);
            
            return $chapter->get(null, $connection);
        }
    }

    public function putChapter($parameters, $chapter) : Message{
        return new \Core\Message(200, "Chapter has been saved!");
    }

    public function postChapter($parameters, $data){
        return new \Core\Message(200, "Chapter has been created!");
    }
}