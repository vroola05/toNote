<?php
namespace model;

class Chapters extends ArrayIterator {

    public function __construct() {
        
    }

    public function append(Chapters $chapters) {
        parent::__construct($chapters);
        //$this->getInnerIterator()->append($chapters);
    }

    public function current() : Notebook
    {
        return parent::current();
    }
}

?>