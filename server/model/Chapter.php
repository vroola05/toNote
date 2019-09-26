<?php
namespace model;

use \core\db\ModelBase;
use \core\db\Mapping;

class Chapter extends ModelBase {

    public $id;
    public $notebookId;
    public $userId;
    public $name;
    public $color ;
    public $creationDate;
    public $modifyDate;
    public $hash;
    public $notes;

    function __construct($json = null) {
        //Build the database structure
        $mapping = new Mapping("chapters");
        $mapping->addColumn("id", "integer");
        $mapping->addColumn("notebookId", "integer");
        $mapping->addColumn("userId", "integer");
        $mapping->addColumn("name", "string", null, 255);
        $mapping->addColumn("color", "string", null, 16);
        $mapping->addColumn("creationDate", "string", "date");
        $mapping->addColumn("modifyDate", "string", "date");
        $mapping->addColumn("hash", "string", null, 255);

        $mapping->addPrimaryKey("id", "id");
        $mapping->addForeignKey("notebooks", "id", "notebookId");

        $this->setMapping($mapping);
        $this->set($json);
    }

    function setId($id) {
        $this->id = $id;
    }

    function getId() {
        return $this->id;
    }

    function setNotebookId($notebookId) {
        $this->notebookId = $notebookId;
    }

    function getNotebookId() {
        return $this->notebookId;
    }

    function setUserId($userId) {
        $this->userId = $userId;
    }

    function getUserId() {
        return $this->userId;
    }

    function setName($name) {
        $this->name = $name;
    }

    function getName() {
        return $this->name;
    }

    function setColor($color) {
        $this->color = $color;
    }

    function getColor() {
        return $this->color;
    }

    function setCreationDate($creationDate) {
        $this->creationDate = $creationDate;
    }

    function getCreationDate() {
        return $this->creationDate;
    }

    function setModifyDate($modifyDate) {
        $this->modifyDate = $modifyDate;
    }

    function getModifyDate() {
        return $this->modifyDate;
    }

    function setNotes($notes){
        $this->notes = $notes;
    }
}

?>
