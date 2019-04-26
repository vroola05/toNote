<?php
namespace Resource;

require 'model/Notebook.php';
require 'model/Notebooks.php';

use \core\Message;
use \core\db\Collection;
use \core\db\Database;
use \core\db\CollectionParams;
use \core\Security;

use \model\Notebook;
use \model\Notebooks;


class NotebookResource {
    function __construct(){
    }

    public function getNotebooks(array $parameters = null) {
        if(!Security::hasAccess()){
            return new \Core\Message(401, "!");
        }

        $result=array();
        $connection = Database::getInstance();
        $connection->dbConnect();
        if($connection->dbPreparedStatement("select n.id, n.userId, n.name, n.creationDate, n.modifyDate, n.hash from notebooks n order by n.name asc" , null)){
            $records = $connection->getFetchData();
            foreach ($records as $record) {
                $notebook = new Notebook();
                $notebook->setId((int)$record["id"]);
                $notebook->setUserId((int)$record["userId"]);
                $notebook->setName($record["name"]);
                if($record["creationDate"]!=null && $record["creationDate"]!="") {
                    $notebook->setCreationDate((new \DateTime($record["creationDate"]))->format(\DateTime::W3C));
                }
                if($record["modifyDate"]!=null && $record["modifyDate"]!="") {
                    $notebook->setModifyDate((new \DateTime($record["modifyDate"]))->format(\DateTime::W3C));
                }
                array_push($result, $notebook);
            }
        }
        return $result;
    }

    public function getNotebook( array $parameters ) : Notebook {
        if( count($parameters)>0 ){
            $connection = Database::getInstance();
            $connection->dbConnect();
            $notebook = new Notebook();
            $notebook->setId($parameters[0]);
            
            $output = $notebook->get(null, $connection);
            if($output !== false){
                return $output;
            }
            Http::setStatus(404);
            throw new \Exception('Not found!');
        }
    }

    public function putNotebook($parameters, $notebook) : Message{
        return new \Core\Message(200, "Notebook has been saved!");
    }

    public function postNotebook($parameters, $data){
        return new \Core\Message(200, "Notebook has been created!");
    }
}