<?php 
namespace model;

use \core\db\Collection;

use \model\Notebook;

class Notebooks extends Collection{
    public $notebook;
    function __construct(array $collumns) {
        $this->notebook = new Notebook();
        $this->addTable($this->notebook, $collumns);

    }
}
?>