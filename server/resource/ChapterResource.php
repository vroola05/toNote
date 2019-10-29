<?php
namespace Resource;

require 'model/Chapter.php';
require 'lists/Colors.php';

use \core\Message;
use \core\db\Database;
use \core\Security;
use \core\Http;
use \core\Lang;

use \dao\Dao;

use \lists\Colors;

use \model\Chapter;

class ChapterResource {
    function __construct(){
    }

    public function getChapters( array $parameters ) {
        if( $parameters!=null && count($parameters) == 1 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            $dao = new Dao();
            return $dao->getChaptersByNotebookId( $connection, $parameters[0], Security::getUserId());
        }
    }

    public function getChapter( array $parameters ) : Chapter {
        if( $parameters!=null && count($parameters) == 2 ){
            $connection = Database::getInstance();
            $connection->dbConnect();

            $chapter = new Chapter();
            $chapter->setNotebookId($parameters[0]);
            $chapter->setUserId(Security::getUserId());
            $chapter->setId($parameters[1]);
            
            return $chapter->get(null, $connection);
        }
    }

    public function putChapter($parameters, $chapter) : Message{
        return new \Core\Message(200, "Chapter has been saved!");
    }

    public function postChapter($parameters, $chapter) {
        if( $parameters!=null && count($parameters) == 1 ){
            
            $input = new Chapter();
            $input->setUserId(Security::getUserId());
            
            $input->setNotebookId($parameters[0]);
            $input->setName($chapter->name);
            
            $input->setColor(Colors::get()[mt_rand(0,count(Colors::get()))]);
            $now = (new \DateTime())->format("Y-m-d H:i:s");
            
            $input->setCreationDate($now);
            $input->setModifyDate($now);
            
            $input->setHash("");
            
            $connection = Database::getInstance();
            $connection->dbConnect();
            $newId = $input->post($connection);
            if($newId !== false){
                
                $message = new \Core\Message(200, Lang::get("notebook_post_saved"));
                $message->addExtraInfo("id", $newId);
                return $message;
            } else {
                Http::setStatus(400);
                $message = new \Core\Message(400, Lang::get("generic_status_400"));
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
}