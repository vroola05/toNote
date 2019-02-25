<?php
namespace core;

class Message {

    public $status;
    public $message;
    public $faults;
    public $info;

    function __construct($status=null, $message=null) {
        $this->status = $status;
        $this->message = $message;
    }

    public function setStatus($status) {
        $this->status = $status;
    }

    public function getStatus() {
        return $this->status;
    }

    public function setMessage($message) {
        $this->message = $message;
    }

    public function getMessage() {
        return $this->message;
    }

    public function setFaults($faults) {
        if (gettype($faults) == "array") {
            foreach ($faults as $fault) {
                if (get_class($fault) != "Fault")
                    return false;
            }
            if ($this->faults !== null) {
                array_merge($this->faults, $faults);
            } else {
                $this->faults = $faults;
            }
            return true;
        }
        return false;
    }

    public function addFault($id, $faultcode) {
        $fault = new Fault();
        $fault->setId($id);
        $fault->setFaultcode($faultcode);
        if ($this->faults === null) {
            $this->faults = array();
        }

        $this->faults[] = $fault;
    }

    public function getFaults() {
        return $this->faults;
    }

    public function addExtraInfo($id, $value) {
        $extraInfo = new ExtraInfo();
        $extraInfo->setId($id);
        $extraInfo->setValue($value);
        if ($this->info === null) {
            $this->info = array();
        }
        $this->info[] = $extraInfo;
    }

}

class Fault {

    public $id;
    public $faultcode;

    function __construct($object = null) {
        if ($object != null) {
            if (array_key_exists("id", $object) == true) {
                $this->id = $object["id"];
            }
            if (array_key_exists("faultcode", $object) == true) {
                $this->faultcode = $object["faultcode"];
            }
        }
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function setFaultcode($faultcode) {
        $this->faultcode = $faultcode;
    }

    public function getFaultcode() {
        return $this->faultcode;
    }

}

class ExtraInfo {

    public $id;
    public $value;

    function __construct() {

    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function setValue($value) {
        $this->value = $value;
    }

    public function getValue() {
        return $this->value;
    }

}


?>