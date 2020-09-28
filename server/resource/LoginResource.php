<?php
namespace Resource;

require 'model/User.php';
require 'model/Sort.php';

use \core\Lang;
use \core\Message;
use \core\Http;
use \core\Security;
use \core\db\Database;

use \dao\Dao;

use \model\User;
use \model\Sort;

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
            Http::setStatus(200);
            Http::remand(new \Core\Message(401, Lang::get("generic_status_401")),Http::CONTENT_TYPE_JSON);
            return false;
        }
        
        if( !array_key_exists("password", $user) || $user->password == "" ){
            Http::setStatus(200);
            Http::remand(new \Core\Message(401, Lang::get("generic_status_401")),Http::CONTENT_TYPE_JSON);
            return false;
        }
        
        $connection = Database::getInstance();
        $connection->dbConnect();
        
        $u = $connection->getSingleItem(new User(), "select * from users where username = ? and active = 1", array($user->username));
        if (isset($u) && $u !== false) {
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
        
        Http::setStatus(200);
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

    public function user() : User {
        $apikey = filter_var(Http::getHeader(Security::$APIKEY), FILTER_SANITIZE_STRING);
        if($apikey !== false && $apikey != ""){
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($connection->dbPreparedStatement("select userId, username, name from users where userId in (select userId from sessions where expirationDate >= ? and apikey = ?)", array( (new \DateTime("NOW"))->format('Y-m-d H:i:s'), $apikey ))){
                $session = $connection->getFetchData();
                if( $session != null && count($session)>0 ){
                    $user = new User();
                    $user->name = $session[0]['name'];
                    $user->username = $session[0]['username'];
                    $user->setSort(Dao::getSortByUserId($connection, $session[0]['userId']));
            //print_r( Dao::getSortByUserId($connection, $session[0]['userId']));
                    return $user;
                }
            }
        }
        
    }

    public function sort($parameters, $sort) : Message {

        $connection = Database::getInstance();
        $connection->dbConnect();
        $input = new Sort();

        $input->setUserId(Security::getUserId());
        $input->setName($sort->name);
        $input->setIdentifier($sort->identifier);
        $input->setSort($sort->sort);

        if ($connection->getSingleItem(new Sort(), "select * from sort where userId = ? and name = ?", array(Security::getUserId(), $parameters[0]))) {
            if ($input->put($connection)) {
                return new \Core\Message(200, Lang::get("notebook_put_saved"));
            } else {
                return $this->getFaultMessage($input->getMessages());
            }
            
        } else {
            if (!$input->post($connection)) {
                return $this->getFaultMessage($input->getMessages());
            } else {
                return new \Core\Message(200, Lang::get("notebook_put_saved"));
            }
        }
        
    }

    private function getFaultMessage(array $faults) {
        Http::setStatus(400);
        $message = new \Core\Message(400, Lang::get("generic_status_400"));
        if($faults){
            foreach($faults as $fault){
                $message->addExtraInfo($fault->id, $fault->faultcode);
            }
        }
        return $message;
    }
}