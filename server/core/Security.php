<?php
namespace core;

require_once 'core/GUID.php';


use \core\db\Database;

abstract class Security {
    const SESSION_EXPIRATION_TIME = 30;
    const APIKEY = "apikey";
    const ALLOWED_HOST = "http://localhost:9000";
    const ALLOWED_HEADERS =  "Content-Type, ". Security::APIKEY;

    /**
     * 
     */
	function  __construct(){
    }

    public static function cors(){
        if($_SERVER['REQUEST_METHOD'] == "OPTIONS"){
            if($_SERVER['HTTP_ORIGIN'] == Security::ALLOWED_HOST) {
                header("Access-Control-Allow-Origin: ". Security::ALLOWED_HOST);
                header("Access-Control-Allow-Methods: PUT, DELETE, POST, GET, OPTIONS");
                header("Access-Control-Allow-Headers: ".Security::ALLOWED_HEADERS);
                header("Access-Control-Max-Age: 1728000");
                header("Content-Length: 0");
                header("Content-Type: text/plain");
            } else {
                header("HTTP/1.1 403 Access Forbidden");
                header("Content-Type: text/plain");
                echo "You cannot repeat this request";
            }

            return true;
        }
        return false;
    }

    public static function hasAccess(){
        $apikey = filter_var(Http::getHeader(Security::APIKEY), FILTER_SANITIZE_STRING);
        if($apikey !== false){
            $connection = Database::getInstance();
            $connection->dbConnect();
            if($connection->dbPreparedStatement("select userId from sessions where expirationDate >= ? and apikey = ?", array( (new \DateTime("NOW"))->format('Y-m-d H:i:s'), $apikey ))){
                $session = $connection->getFetchData();
                if( $session != null && count($session)>0 ){
                    Security::updateSession("", $apikey);
                    return true;
                }
            }
        }
        return false;
    }

    public static function createSession($userId , $description ){
        $apikey = Security::generateApiKey();

        $lastAccessDate = new \DateTime("NOW");
        $expirationDate = new \DateTime("NOW");
        $expirationDate->add(new \DateInterval('PT' . (Security::SESSION_EXPIRATION_TIME) . 'M'));

        $connection = Database::getInstance();
        $connection->dbConnect();

        if($connection->dbPreparedStatement("insert into sessions (apikey, lastAccessDate, expirationDate, description) values (?,?,?,?)",
        array(
            $apikey,
            $lastAccessDate->format('Y-m-d H:i:s'),
            $expirationDate->format('Y-m-d H:i:s'),
            $description
        ))){
            return $apikey;
        } else {
            return false;
        }
        //$dateTime->format(\DateTime::W3C);
    }

    public static function updateSession( $description, $apikey ){
        $lastAccessDate = new \DateTime("NOW");
        $expirationDate = new \DateTime("NOW");
        $expirationDate->add(new \DateInterval('PT' . (Security::SESSION_EXPIRATION_TIME) . 'M'));

        $connection = Database::getInstance();
        $connection->dbConnect();

        if($connection->dbPreparedStatement("update sessions set lastAccessDate = ?, expirationDate = ?, description = ? where apikey = ?",
        array(
            $lastAccessDate->format('Y-m-d H:i:s'),
            $expirationDate->format('Y-m-d H:i:s'),
            $description,
            $apikey
        ))){
            return true;
        } else {
            return false;
        }
        //$dateTime->format(\DateTime::W3C);
    }

    public static function removeSession(){
        $apikey = filter_var(Http::getHeader(Security::APIKEY), FILTER_SANITIZE_STRING);
        if($apikey !== false){
            $connection = Database::getInstance();
            $connection->dbConnect();

            if($connection->dbPreparedStatement("delete from sessions where apikey = ?", array($apikey))){
                return true;
            }
        }
        return false;
    }

    public static function generateApiKey(){
        return GUID::v4();
    }

    public static function getPasswordAlgorithm() {
        return array("algorithm" => PASSWORD_BCRYPT, "options" => array("cost" => 12));
    }

    public static function hashString(string $input, array $algorithm) {
        return password_hash($input, $algorithm["algorithm"], $algorithm["options"]);
    }

    
}
?>