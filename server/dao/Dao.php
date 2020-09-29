<?php
namespace dao;

use \core\db\Database;
use \model\Notebook;
use \model\Chapter;
use \model\Note;
use \model\Sort;

class Dao {
    public static function updateNoteSort( Database $connection, int $chapterId, int $id, int $userId, int $from, int $to) : bool {
        if ( $from > $to ) {
            if($connection->dbPreparedStatement("update notes n set n.sort = n.sort + 1 where n.userId = ? and n.sectionId = ? and n.sort >= ? and n.sort < ?", array($userId, $chapterId, $to, $from))){
                if($connection->dbPreparedStatement("update notes n set n.sort = ? where n.userId = ? and n.sectionId = ? and n.id = ?", array($to, $userId, $chapterId,  $id))){
                    return true;
                }
            }
        } else if ( $from < $to ) {
            if($connection->dbPreparedStatement("update notes n set n.sort = n.sort - 1 where n.userId = ? and n.sectionId = ? and n.sort > ? and n.sort <= ?", array($userId, $chapterId, $from, $to ))){
                if($connection->dbPreparedStatement("update notes n set n.sort = ? where n.userId = ? and n.sectionId = ? and n.id = ?", array($to, $userId, $chapterId,  $id))){
                    return true;
                }
            }
        }
        return false;
    }

    public static function resetNoteSortByChapterId( Database $connection, int $chapterId, int $userId ) : bool {
        if($connection->dbPreparedStatement("SET @row_number = 0; update notes n inner join (SELECT (@row_number:=@row_number + 1) AS new_sort, n1.id FROM notes n1 where n1.sectionId = ? and n1.userId = ? order by n1.sort asc) n2 on n2.id = n.id set n.sort = n2.new_sort where n.userId = ?" , array($chapterId, $userId, $userId))){
            return true;
        }
        return false;
    }
    public static function getNoteCountByChapterId( Database $connection, int $chapterId, int $userId ) : string {
        $sort = $connection->getSingleItem(new Note(), "select count(*) as sort from notes where userId = ? and sectionId = ?", array($userId, $chapterId));
        if ($sort) {
            return $sort->sort;
        }
        return '0';
    }

    public static function getChapterCountByNotebookId( Database $connection, int $notebookId, int $userId ) : string {
        $sort = $connection->getSingleItem(new Chapter(), "select count(*) as sort from chapters where userId = ? and notebookId = ?", array($userId, $notebookId));
        if ($sort) {
            return $sort->sort;
        }
        return '0';
    }

    public static function getNotebookCount( Database $connection, int $userId ) : string {
        $sort = $connection->getSingleItem(new Notebook(), "select count(*) as sort from notebooks where userId = ?", array($userId));
        if ($sort) {
            return $sort->sort;
        }
        return '0';
    }

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
        if($connection->dbPreparedStatement("select id, sectionId, userId, name, creationDate, modifyDate, sort, hash from notes where sectionId = ? and userId = ? order by ". $sort->identifier. " " .$sort->sort, array($chapterId, $userId))){
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
                $note->setSort($record["sort"]);
                
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