<?php
namespace model;

use \core\db\ModelBase;
use \core\db\Mapping;

class User extends ModelBase {

    public $userId;
    public $username;
    public $password;
    public $active;
    public $firstname;
    public $lastname;
    public $phone;
    public $address;
    public $groups;
    public $stateType;
    public $stateId;

    function __construct($json = null) {
        //Build the database structure
        $mapping = new Mapping("users");
        $mapping->addColumn("userId", "integer");
        $mapping->addColumn("username", "string", null, 70);
        $mapping->addColumn("password", "string", null, 14);
        $mapping->addColumn("active", "boolean");
        $mapping->addColumn("firstname", "string", null, 255);
        $mapping->addColumn("lastname", "string", null, 255);
        $mapping->addColumn("phone", "string", null, 20);
        $mapping->addColumn("address", "string", null, 255);
        $mapping->addColumn("stateType", "string", null, 8);
        $mapping->addColumn("stateId", "integer");

        $mapping->addPrimaryKey("userId", "userId");

        $this->setMapping($mapping);
        $this->set($json);
    }

    function setUserId($userId) {
        $this->setVar("userId", $userId);
    }
    function getUserId() {
        return $this->userId;
    }

    function setUsername($username) {
        $this->setVar("username", $username);
    }
    function getUsername() {
        return $this->username;
    }

    function setPassword($password) {
        $this->setVar("password", $password);
    }
    function getPassword() {
        return $this->password;
    }

    function setActive($active) {
        $this->setVar("active", $active);
    }
    function getActive() {
        return $this->active;
    }

    function setFirstname($firstname) {
        $this->setVar("firstname", $firstname);
    }
    function getFistname() {
        return $this->firstname;
    }

    function setLastname($lastname) {
        $this->setVar("lastname", $lastname);
    }
    function getLastname() {
        return $this->lastname;
    }

    function setPhone($phone) {
        $this->setVar("phone", $phone);
    }
    function getPhone() {
        return $this->phone;
    }

    function setAddress($address) {
        $this->setVar("address", $address);
    }
    function getAddress() {
        return $this->address;
    }

    function getGroups() {
        return $this->groups;
    }
    function setGroups($groups) {
        $this->groups = $groups;
    }

    function setStateType($stateType) {
        $this->setVar("stateType", $stateType);
    }
    function getStateType() {
        return $this->stateType;
    }
    function setStateId($stateId) {
        $this->setVar("stateId", $stateId);
    }
    function getStateId() {
        return $this->stateId;
    }
}
?>
