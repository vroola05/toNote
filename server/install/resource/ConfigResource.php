<?php
namespace Resource;

use \core\Message;
use \core\Http;
use \core\Security;
use \core\db\Database;

class Conf {
    public $dbHost;
    public $dbPort;
    public $dbDatabase;
    public $dbUsername;
    public $dbPassword;
    public $serverUrl;
    public $clientUsername;
    public $clientPassword;
    public $clientRePassword;

}

class ConfigResource {
    private $db;
    private $errMsg = "";

    function __construct(){
    }

    public function get( array $parameters ) : Conf {
        $conf = new Conf();

        $filename = "../config/conf.ini";
        if( file_exists ($filename) ) {
        
            $ini = parse_ini_file($filename);
            if(array_key_exists("dbHost", $ini)){
                $conf->dbHost = $ini["dbHost"];
            }
            if(array_key_exists("dbPort", $ini)){
                $conf->dbPort = $ini["dbPort"];
            }
            if(array_key_exists("dbDatabase", $ini)){
                $conf->dbDatabase = $ini["dbDatabase"];
            }

            if(array_key_exists("dbUsername", $ini)){
                $conf->dbUsername = $ini["dbUsername"];
            }
            if(array_key_exists("dbPassword", $ini)){
                $conf->dbPassword    = $ini["dbPassword"];
            }
            $conf->serverUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
        }

        return $conf;
    }

    public function post(array $parameters, $data) : Message{
        $conf = new Conf();
        $conf->dbHost = $data->dbHost;
        $conf->dbPort = $data->dbPort;
        $conf->dbUsername = $data->dbUsername;
        $conf->dbPassword = $data->dbPassword;
        $conf->dbDatabase = $data->dbDatabase;
        
        if(!$this->checkDatabase($conf)){
            $message = new Message(401, "Something went wrong!");
            $message->addExtraInfo("database", $this->errMsg);
            return $message;
        }
        if(!$this->checkTable($conf)){
            $message = new Message(401, "Something went wrong!");
            $message->addExtraInfo("table", $this->errMsg);
            return $message;
        }
        return $message;
    }

    /**
     * 
     */
    public function checkDatabase( Conf $conf ) : bool {
        $success = true;
        if(!isset($conf->dbHost) || $conf->dbHost == "" ){
            $this->errMsg .= "Hostname can't be empty!<br />";
            $success = false;
        }

        if(!isset($conf->dbPort) || $conf->dbPort == "" ){
            $this->errMsg .= "Port can't be empty!<br />";
            $success = false;
        }

        if(!isset($conf->dbUsername) || $conf->dbUsername == "" ){
            $this->errMsg .= "Username can't be empty!<br />";
            $success = false;
        }

        if(!isset($conf->dbPassword) || $conf->dbPassword == "" ){
            $this->errMsg .= "Password can't be empty!<br />";
            $success = false;
        }

        if($success){
            try {
                $this->db = new \PDO('mysql:host=' . $conf->dbHost . ';dbname=' . $conf->dbDatabase . '', $conf->dbUsername, $conf->dbPassword);
                $this->db->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
                return true;
            } catch (\Exception $e) {
                $this->errMsg .= "Can't connect to the database!<br />";
            }
        }
        return false;
    }

    public function checkTable( Conf $conf ) : bool {
        if($conf->dbDatabase == null || $conf->dbDatabase == ""){
            $this->errMsg .= "Database name can't be empty!<br />";
            return false;
        }
        $query = "SELECT count(*) as 'amount'  FROM INFORMATION_SCHEMA.TABLES WHERE  TABLE_SCHEMA = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $conf->dbDatabase);
        
        if($stmt->execute()){
            $result = $stmt->fetch(\PDO::FETCH_ASSOC);
            if($result["amount"]>0){
                $this->errMsg .= "Table already exists!<br />";
                return false;
            }
        }
        return true;
    }

   
}