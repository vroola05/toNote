<?php
namespace Resource;

require 'model/Notebook.php';
require 'model/Notebooks.php';

use \core\Message;
use \core\db\Collection;
use \core\db\Database;
use \core\db\CollectionParams;
use \core\Security;
use \core\Http;

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
            
            Http::setStatus(404);
            throw new \Exception('Not found!');
        }
    }

    public function postNotebook($parameters, $notebook) : Message{
        return new \Core\Message(200, "Notebook has been saved!");
    }

    public function putNotebook($parameters, $notebook){
        $connection = Database::getInstance();
        $connection->dbConnect();
        $input = new Notebook();
        $input->setId($notebook->id);
        $input->setUserId(Security::getUserId());
        $input->setName($notebook->name);
        
        $input->setCreationDate((new \DateTime($notebook->creationDate))->format("Y-m-d H:i:s"));
        $input->setModifyDate((new \DateTime($notebook->modifyDate))->format("Y-m-d H:i:s"));
        $input->setHash('');
        
        if($input->put($connection)){
            return new \Core\Message(200, "Update successfull!");
        } else {
            Http::setStatus(400);
            $message = new \Core\Message(400, "Something went wrong!");
            $messages = $input->getMessages();
            if($messages){
                foreach($messages as $m){
                    $message->addExtraInfo($m->id, $m->faultcode);
                }
            }
            return $message;
        }
    }
}