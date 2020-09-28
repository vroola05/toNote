<?php
namespace dao;

use \core\db\Database;
use \model\Chapter;
use \model\Note;
use \model\Sort;

class Dao {
    
    public static function getSortByUserIdAndName( Database $connection, int $userId, string $name, string $defaultColumn, array $allowedFields = array("name", "creationDate","modifyDate","sort") ) : Sort {

        $sort = $connection->getSingleItem(new Sort(), "select * from sort where userId = ? and name = ?", array($userId, $name));
        if ($sort) {
            if( !in_array(strtolower($sort->sort), array("asc", "desc"))) {
                $sort->sort = "asc";
            }
            if( !in_array($sort->identifier, $allowedFields)) {
                
                $sort->identifier = $defaultColumn;
            }
            return $sort;
        } else {
            $sort = new Sort();
            $sort->identifier = $defaultColumn;
            $sort->sort = "asc";
            return $sort;
        }
    }

    public static function getSortByUserId( Database $connection, int $userId ) : array {
        $result=array();
        if($connection->dbPreparedStatement("select c.name, c.identifier, c.sort from sort c where c.userId = ?" , array($userId))){
            $records = $connection->getFetchData();
            foreach ($records as $record) {
                $sort = new Sort();
                $sort->setName($record["name"]);
                $sort->setIdentifier($record["identifier"]);
                $sort->setSort($record["sort"]);
                array_push($result, $sort);
            }
        }
        return $result;
    }

    public static function getNotebooksWhereNotNotebookId( Database $connection, int $notebookId, int $userId ) : array {

        $result=array();
        if($connection->dbPreparedStatement("select c.id, c.userId, c.name, c.creationDate, c.modifyDate, c.hash from notebooks c where c.id != ? and c.userId = ? order by c.name asc" , array($notebookId, $userId))){
            $records = $connection->getFetchData();
            foreach ($records as $record) {
                $chapter = new Chapter();
                $chapter->setId((int)$record["id"]);
                $chapter->setUserId((int)$record["userId"]);
                $chapter->setName($record["name"]);
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

    public static function getChaptersWhereNotChapterId( Database $connection, int $chapterId, int $userId ) : array {

        $result=array();
        if($connection->dbPreparedStatement("select c.id, c.userId, concat(n.name, ' - ', c.name) as name, c.creationDate, c.modifyDate, c.hash from notebooks n, chapters c where n.id = c.notebookId and c.id != ? and c.userId = ? order by n.name asc, c.name asc" , array($chapterId, $userId))){
            $records = $connection->getFetchData();
            foreach ($records as $record) {
                $chapter = new Chapter();
                $chapter->setId((int)$record["id"]);
                $chapter->setUserId((int)$record["userId"]);
                $chapter->setName($record["name"]);
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


    public static function getChaptersByNotebookId( Database $connection, int $notebookId, int $userId ) : array {

        $result=array();

        $sort = Dao::getSortByUserIdAndName($connection, $userId, "chapters", "name");
        if($connection->dbPreparedStatement("select c.id, c.notebookId, c.userId, c.name, c.color, c.creationDate, c.modifyDate, c.hash from chapters c where c.notebookId = ? and c.userId = ? order by ". $sort->identifier. " " .$sort->sort, array($notebookId, $userId))){
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

    public static function getNotesByChapterId( Database $connection, int $chapterId, int $userId ) : array {
        $result=array();

        $sort = Dao::getSortByUserIdAndName($connection, $userId, "notes", "name");
        if($connection->dbPreparedStatement("select id, sectionId, userId, name, creationDate, modifyDate, hash from notes where sectionId = ? and userId = ? order by ". $sort->identifier. " " .$sort->sort, array($chapterId, $userId))){
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

    public static function deleteChapters( Database $connection, int $notebookId, int $userId ) : bool {
        if($connection->dbPreparedStatement("delete from chapters where notebookId = ? and userId = ?" , array($notebookId, $userId))){
            return true;
        }
        return false;
    }

    public static function deleteChapter( Database $connection, int $notebookId, int $chapterId, int $userId ) : bool {
        if($connection->dbPreparedStatement("delete from chapters where notebookId = ? and chapterId = ? and userId = ?" , array($notebookId, $chapterId, $userId))){
            return true;
        }
        return false;
    }

    public static function deleteNotes( Database $connection, int $chapterId, int $userId ) : bool {
        if($connection->dbPreparedStatement("delete from notes where sectionId = ? and userId = ?" , array($chapterId, $userId))){
            return true;
        }
        return false;
    
    }

    public static function deleteNote( Database $connection, int $chapterId, int $notesId, int $userId ) : bool {
        if($connection->dbPreparedStatement("delete from notes where sectionId = ? and id = ? and userId = ?" , array($chapterId, $notesId, $userId))){
            return true;
        }
        return false;
    }
}