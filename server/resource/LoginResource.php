<?php
namespace Resource;

require 'model/User.php';

use \core\Lang;
use \core\Message;
use \core\Http;
use \core\Security;
use \core\db\Database;

use \model\User;

class LoginResource {
    function __construct(){
    }

    public function login( $user ) : bool {
        $message = new Message();
        
        if( $_SERVER['REQUEST_METHOD'] != Http::HTTP_METHOD_POST ){
            Http::setStatus(401);
            Http::remand(new \Core\Message(401, Lang::get("generic_status_401")),Http::CONTENT_TYPE_JSON);
            return false;
        }
        
        if( $user==null || !array_key_exists("username", $user) || $user->username == "" ){
            Http::setStatus(401);
            Http::remand(new \Core\Message(401, Lang::get("generic_status_401")),Http::CONTENT_TYPE_JSON);
            return false;
        }
        
        if( !array_key_exists("password", $user) || $user->password == "" ){
            Http::setStatus(401);
            Http::remand(new \Core\Message(401, Lang::get("generic_status_401")),Http::CONTENT_TYPE_JSON);
            return false;
        }
        
        $connection = Database::getInstance();
        $connection->dbConnect();
        
        $u = $connection->getSingleItem(new User(), "select * from users where username = ? and active = 1", array($user->username));
        if ($u !== false) {
            if ($u->userId !== null && $u->password != null && $u->password != "") {
                if (password_verify($user->password, $u->password) === true) {
                    //If the password algorithm has changed update the password
                    $this->checkPasswordAlgorithm((int)$u->userId, $u->password, $connection);        
                    $apikey = Security::createSession($u->userId, "DeviceName");
                    if($apikey !== false){
                        $message  = new \Core\Message(200, Lang::get("login_success"));
                        
                        $message->addExtraInfo(Security::$APIKEY, $apikey);
                        Http::setStatus(200);
                        Http::remand($message,Http::CONTENT_TYPE_JSON);
                        return true;
                    }
                }
            } 
        }
        
        Http::setStatus(401);
        Http::remand(new \Core\Message(401, Lang::get("login_login_failed")),Http::CONTENT_TYPE_JSON);
        return false;
    }

    public function check( array $parameters ) : Message {
        return new \Core\Message(200, Lang::get("login_valid"));
    }

    public function logout( array $parameters ) : Message {
        if(Security::removeSession()){
            return new \Core\Message(200, Lang::get("login_signed_out"));
        }
        Http::setStatus(400);
        return new \Core\Message(400, Lang::get("generic_status_400"));
    }

    public function checkPasswordAlgorithm(int $id, string $hash, Database $connection ){
        $algorithm = Security::getPasswordAlgorithm();
        if (password_needs_rehash($hash, $algorithm["algorithm"], $algorithm["options"]) === true) {
            $user = new User();
            $user->setId($id);
            $user->setPassword(Security::hashString($password, $algorithm));
            $user->put($connection);
        }
    }
   
}