<?php
namespace model;

use \core\db\ModelBase;
use \core\db\Mapping;

class Notebook extends ModelBase {

    public $id;
    public $userId;
    public $name;
    public $creationDate;
    public $modifyDate;
    public $hash;
    public $chapters;
    
    function __construct($json = null) {
        //Build the database structure
        $mapping = new Mapping("notebooks");
        $mapping->addColumn("id", "integer");
        $mapping->addColumn("userId", "integer");
        $mapping->addColumn("name", "string", null, 255);
        $mapping->addColumn("creationDate", "datetime", "datetime");
        $mapping->addColumn("modifyDate", "datetime", "datetime");
        $mapping->addColumn("hash", "string", null, 255);

        $mapping->addPrimaryKey("id", "id");
        $mapping->addForeignKey("users", "userId", "userId");

        $this->setMapping($mapping);
        $this->set($json);
    }

    function setId( int $id ) {
        $this->id = $id;
    }

    function getId() : int {
        return $this->id;
    }

    function setUserId( int $userId ) {
        $this->userId = $userId;
    }

    function getUserId() : int {
        return $this->userId;
    }

    function setName(string $name) {
        $this->name = $name;
    }

    function getName() : string {
        return $this->name;
    }

    function setCreationDate( string $creationDate ) {
        $this->creationDate = $creationDate;
    }

    function getCreationDate() : string {
        return $this->creationDate;
    }

    function setModifyDate( string $modifyDate )  {
        $this->modifyDate = $modifyDate;
    }

    function getModifyDate() : string {
        return $this->modifyDate;
    }

    function setChapters($chapters){
        $this->chapters = $chapters;
    }
}

?>