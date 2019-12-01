<?php
namespace model;

use \core\db\ModelBase;
use \core\db\Mapping;

class Groups extends ModelBase {

    public $groupId;
    public $name;

    function __construct($json = null) {
        //Build the database structure
        $mapping = new Mapping("groups");
        $mapping->addColumn("groupId", "integer", "groupId");
        $mapping->addColumn("name", "string", "name", null, 100);

        $mapping->addPrimaryKey("groupId", "groupId");

        $this->setMapping($mapping);
        $this->set($json);
    }

    function setGroupId($groupId) {
        $this->setVar("groupId", $groupId);
    }
    function getGroupId() {
        return $this->groupId;
    }

    function setName($name) {
        $this->setVar("name", $name);
    }
    function getName() {
        return $this->name;
    }
}
?>
