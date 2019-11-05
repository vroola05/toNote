<?php
namespace Model;

use \core\db\ModelBase;
use \core\db\Mapping;

class Note extends ModelBase {

    public $id;
    public $sectionId;
    public $userId;
    public $name;
    public $note;
    public $creationDate;
    public $modifyDate;
    public $hash;

    function __construct($json = null) {
        //Build the database structure
        $mapping = new Mapping("notes");
        $mapping->addColumn("id", "integer");
        $mapping->addColumn("sectionId", "integer");
        $mapping->addColumn("userId", "integer");
        $mapping->addColumn("name", "string", null, 255);
        $mapping->addColumn("note", "string", null);
        $mapping->addColumn("creationDate", "datetime", "date");
        $mapping->addColumn("modifyDate", "datetime", "date");
        $mapping->addColumn("hash", "string", null, 255);

        $mapping->addPrimaryKey("id", "id");
        $mapping->addForeignKey("chapters", "id", "sectionId");

        $this->setMapping($mapping);
        $this->set($json);
    }

    function setId($id) {
        $this->id = $id;
    }

    function getId() {
        return $this->id;
    }

    function setSectionId($sectionId) {
        $this->sectionId = $sectionId;
    }

    function getSectionId() {
        return $this->sectionId;
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

    function setHash($hash) {
        $this->hash = $hash;
    }

    function getHash() {
        return $this->hash;
    }

    function setNote($note) {
        $this->note = $note;
    }

    function getNote() {
        return $this->note;
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

}

?>