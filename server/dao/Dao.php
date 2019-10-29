<?php
namespace dao;

use \core\db\Database;
use \model\Chapter;

class Dao {
    function __construct(){
    }

    public function getChaptersByNotebookId( Database $connection, int $notebookId, int $userId ) : array {

        $result=array();
        if($connection->dbPreparedStatement("select c.id, c.notebookId, c.userId, c.name, c.color, c.creationDate, c.modifyDate, c.hash from chapters c where c.notebookId = ? and c.userId = ? order by c.name asc" , array($notebookId, $userId))){
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

    public function deleteChapter( Database $connection, int $notebookId, int $chapterId, int $userId ) : boolean {
        if($connection->dbPreparedStatement("delete from chapters where notebookId = ? and chapterId = ? and c.userId = ?" , array($notebookId, $chapterId, $userId))){
            return true;
        }
        return false;
    }
}