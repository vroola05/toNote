<?php
namespace Resource;

require 'model/User.php';

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

        if( $user==null || !array_key_exists("username", $user) || $user->username == "" ){
            Http::setStatus(401);
            Http::remand(new \Core\Message(401, "Not authorized!"),Http::CONTENT_TYPE_JSON);
            return false;
        }
        if( !array_key_exists("password", $user) || $user->password == "" ){
            Http::setStatus(401);
            Http::remand(new \Core\Message(401, "Not authorized!"),Http::CONTENT_TYPE_JSON);
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
                        $message  = new \Core\Message(200, "Login succeded");
                        $message->addExtraInfo(Security::APIKEY, $apikey);
                        Http::setStatus(200);
                        Http::remand($message,Http::CONTENT_TYPE_JSON);
                        return true;
                    }
                }
            } 
        }
        Http::setStatus(401);
        Http::remand(new \Core\Message(401, "Username or password is wrong!"),Http::CONTENT_TYPE_JSON);
        return false;
    }

    public function check( array $parameters ) : Message {
        return new \Core\Message(200, "Apikey still valid!");
    }

    public function logout( array $parameters ) : Message {
        if(Security::removeSession()){
            return new \Core\Message(200, "Session removed!");
        }
        Http::setStatus(400);
        return new \Core\Message(400, "Not found!");
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