<?php
namespace core\db;

use PDO;
use \core\Conf;

class Database {

    private $dbHost;
    private $dbUser;
    private $dbPass;
    private $dbName;
    private $db;
    private $stmt;
    private $error;
    private static $instantce;

    private function __construct($conf=null) {
        try{
            $this->dbHost = Conf::get("db.host");
            $this->dbUser = Conf::get("db.username");
            $this->dbPass = Conf::get("db.password");
            $this->dbName = Conf::get("db.database");
        } catch(Exception $e){
            throw new \Exception("Unable to read config file!");
        }
    }

    // Een public methode om de instantce te verkrijgen
    public static function getInstance() {
        if (self::$instantce == null) {
            self::$instantce = new Database();
        }
        return self::$instantce;
    }

    function setDbInfo($user, $pass, $name, $server = "localhost") {
        $this->dbUser = $user;
        $this->dbPass = $pass;
        $this->dbName = $name;
        $this->dbHost = $server;
    }

    function dbConnect() {
        try {
            $this->db = new PDO('mysql:host=' . $this->dbHost . ';dbname=' . $this->dbName . '', $this->dbUser, $this->dbPass);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            $this->error = array(
                "code" => $e->getCode(),
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString()
            );
            return false;
        }
        return true;
    }

    function dbClose() {
        $this->db = null;
    }


    function dbexecute($query, $type = "select") {
        try {
            $this->stmt = $this->db->prepare($query);
            $this->stmt->execute();
        } catch (Exception $e) {
            $this->error = array(
                "code" => $e->getCode(),
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString()
            );
            return false;
        }
        return true;
    }

    function dbPreparedStatement($query, $param) {
        $this->stmt = $this->db->prepare($query);
        if ($param!=null && sizeof($param) > 0) {
            for ($i = 0; $i < sizeof($param); $i++) {
                $this->stmt->bindParam($i + 1, $param[$i]);
            }
        }
        try {
            return $this->stmt->execute();
        } catch (Exception $e) {
            $this->error = array(
                "code" => $e->getCode(),
                "message" => $e->getMessage(),
                "trace" => $e->getTraceAsString()
            );
            return false;
        }
        
    }

    /**
     * Never print this error directly to the screen unless you are sure that it's save
     * It contains the tracelog (that can hold the sql query)
     * 
     * @return type
     */
    public function getError() {
        return $this->error;
    }

    public function getLastInsertId() {
        return $this->db->lastInsertId();
    }

    public function getFetchData() {
        return $this->stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * 
     */
    public function getSingleItem($item, string $query, array $param) {
        if($this->dbPreparedStatement($query, $param)){
            $this->stmt->setFetchMode(PDO::FETCH_INTO, $item);
            $result = $this->stmt->fetch();
            if($result!== false) {
                return $result;
            }
            
        }
        return null;
    }
}

?>
