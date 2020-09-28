<?php
namespace model;

use \core\db\ModelBase;
use \core\db\Mapping;

class Sort extends ModelBase {

    public $userId;
    public $name;
    public $identifier;
    public $sort;
    
    function __construct($json = null) {
        //Build the database structure
        $mapping = new Mapping("sort");
        $mapping->addColumn("userId", "integer");
        $mapping->addColumn("name", "string", null, 20);
        $mapping->addColumn("identifier", "string", null, 20);
        $mapping->addColumn("sort", "string", null, 4);

        $mapping->addPrimaryKey("userId", "userId");
        $mapping->addPrimaryKey("name", "name");
        $mapping->addForeignKey("users", "userId", "userId");

        $this->setMapping($mapping);
        $this->set($json);
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

    function setIdentifier( string $identifier ) {
        $this->identifier = $identifier;
    }

    function getIdentifier() : string {
        return $this->identifier;
    }

    function setSort( string $sort )  {
        $this->sort = $sort;
    }

    function getSort() : string {
        return $this->sort;
    }
}

?>