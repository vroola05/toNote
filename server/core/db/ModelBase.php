<?php
namespace core\db;

use \core\Lang;
use \core\Validator;
use \core\Fault;
/**

 */
class ModelBase {

    private $error; //Stores any sql error
    private $messages; //Stores validation errors
    private $mapping; //Stores the mapping to the database    
    
    private $in;

    function __construct() {

    }

    public function set($json) {
        if ($json != null) {
            foreach ($json as $key => $value) {
                $this->{$key} = $value;
            }
        }
    }

    public function validate() {
        $validator = new Validator();
        $this->messages = array();

        foreach ($this->mapping->primaryKeys as $fieldName) {
            if (!$this->$fieldName == null && !ctype_digit((string) $this->$fieldName)) {
                $fault = new Fault();
                $fault->setId($fieldName);
                $fault->setFaultcode(Lang::get("db_valid_int"));
                $this->messages[] = $fault;
            }
        }
        foreach ($this->mapping->columns as $columnName => $column) {
            $value = $this->{$columnName};
            
            $faultcode = null;
            if ($value != null && $value != "") {
                switch ($column->columnType) {
                    case "string":
                        if (!is_string($value)) {
                            $faultcode = Lang::get("db_valid_string");
                        }
                        break;
                    case "boolean":
                        if (!is_bool($value) && $value != "1" && $value != "0") {
                            $faultcode = Lang::get("db_valid_bool");
                        }
                        break;
                    case "integer":
                        if (!ctype_digit((string) $value)) {
                            $faultcode = Lang::get("db_valid_int");
                        }
                        break;
                    case "double":
                        if (!is_numeric($value)) {
                            $faultcode = Lang::get("db_valid_double");
                        }
                        break;
                    case "date":
                        if (!$validator->checkSqlDate($value, 'Y-m-d')) {
                            $faultcode = Lang::get("db_valid_date_format", $value);
                        }
                        break;
                    case "datetime":
                        if (!$validator->checkSqlDate($value, 'Y-m-d H:i:s')) {
                            $faultcode = Lang::get("db_valid_datetime_format", $value);
                        }
                        break;
                    case "blob":
                        break;
                    default:
                        break;
                }
                if ($column->validate != null) {
                    switch ($column->validate) {
                        case "email":
                            if (!$validator->checkMail($value)) {
                                $faultcode = Lang::get("db_valid_email");
                            }
                            break;
                        case "phone":
                            if (!$validator->checkPhone($value)) {
                                $faultcode = Lang::get("db_valid_phone");
                            }
                            break;
                        case "postal":
                            if (!$validator->checkPostal($value)) {
                                $faultcode = Lang::get("db_valid_postal");
                            }
                            break;
                        case "password":
                            if (!$validator->checkPassword($value)) {
                                $faultcode = Lang::get("db_valid_password_strength");
                            }
                            break;
                        default :
                            break;
                    }
                }
                if ($column->length != null) {
                    if (strlen($value) > $column->length) {
                        $faultcode = Lang::get("db_valid_strlen", $column->length);
                    }
                }
                if ($faultcode != null) {
                    $fault = new Fault();
                    $fault->setId($columnName);
                    $fault->setFaultcode($faultcode);
                    
                    $this->messages[] = $fault;
                    
                }
            }
        }
        if (count($this->messages) > 0)
            return false;
        else
            return true;
    }

    public function getMessages() {
        if ($this->messages == null || count($this->messages) == 0) {
            return false;
        } else {
            return $this->messages;
        }
    }

    public function getTableName() {
        return $this->mapping->tablename;
    }

    public function setMapping($mapping) {
        $this->mapping = $mapping;
    }

    public function getMapping() {
        return $this->mapping;
    }

    public function getForeignKeys() {
        return $this->mapping->foreignKeys;
    }

    public function setForeignKeyPrefix($culumnName, $prefix) {
        $this->mapping->foreignKeys[$culumnName]->setPrefix($prefix);
    }

    public function post($connection = null) {
        if ($connection == null) {
            return false;
        }
        if ($this->validate() === false) {
            return false;
        }

        $foreignKeys = array();
        if(!$this->areForeignkeysSet($foreignKeys)){
            return false;
        }

        $params = array();
        $keys = "";
        $values = "";
        foreach ($this->mapping->columns as $columnName => $column) {
            $keys .= ($keys != "" ? ", " : "") . "`" . $columnName . "`";
            $values .= ($values != "") ? ", ?" : "?";
            $params[] = $this->{$columnName};
        }

        $query = "insert into " . $this->mapping->tablename . " (" . $keys . ") values (" . $values . ")";
        if ($connection->dbPreparedStatement($query, $params)) {
            $output = $connection->getLastInsertId();
        } else {
            $this->error = $connection->getError();
            $output = false;
        }
        
        return $output;
    }
    /**
     * Saves an object to the database. If the object has a primary key that is not null
     * it does an update, else it insert the object
     * @param type $parentId - The parentId is only used for inserts. For every
     * update an id needs to exist, and is must contain a value you can map the
     * id using the Mapping::addId function
     * @return boolean - if returned false check the getError function for the
     * errormessage.
     */
    public function put($connection = null, array $keys = null) {
        if ($connection == null) {
            return false;
        }
        if ($this->validate() === false) {
            return false;
        }

        $params = array();
        $primaryKeys = array();
        $foreignKeys = array();

        
        if(!$this->arePrimarykeysSet($primaryKeys)){
            return false;
        }

        if(!$this->areForeignkeysSet($foreignKeys)){
            return false;
        }

        $values = "";
        $where = "";
        
        foreach ($this->mapping->columns as $columnName => $column) {
            if (
                !array_key_exists($columnName, $primaryKeys) 
                && !array_key_exists($columnName, $this->mapping->foreignKeys)
                && ($keys == null || array_key_exists($columnName, $keys))
                ) {
                $values .= ($values != "" ? ", " : "") . $columnName . "=?";
                $params[] = $this->{$columnName};
            }
        }

        foreach ($primaryKeys as $columnName => $value) {
            $where .= ($where != "" ? " and " : "") . $columnName . "=?";
            $params[] = $value;
        }
        
        foreach ($foreignKeys as $columnName => $value) {
            $where .= ($where != "" ? " and " : "") . $columnName . "=?";
            $params[] = $value;
        }

        $query = "update " . $this->mapping->tablename . " set " . $values . " where " . $where;

        //If the query succeeds
        if ($connection->dbPreparedStatement($query, $params)) {
            return true;
        }
        //If the query fails
        else {
            $this->error = $connection->getError();
            return false;
        }
    }

    public function arePrimarykeysSet(array &$primaryKeys) {
        
        foreach ($this->mapping->primaryKeys as $columnName => $fieldName) {
            $primaryKeys[$columnName] = $this->$fieldName;
            //a zero is threated as empty so i added !is_numeric
            if (!isset( $primaryKeys[$columnName] ) || (empty($primaryKeys[$columnName]) && !is_numeric($primaryKeys[$columnName]))) {
                $this->error = array(
                    "code" => "2000",
                    "message" => "Primarykeys can't be empty!",
                );
                return false;
                
            }
        }
        return true;
    }

    public function areForeignkeysSet(array &$primaryKeys) {
        foreach ($this->mapping->foreignKeys as $columnName => $map) {
            $foreignKeys[$columnName] = $this->$columnName;
            //a zero is threated as empty so i added !is_numeric
            if (
                !isset( $this->$columnName ) || 
                (empty($this->$columnName) && !is_numeric($this->$columnName))
            ) {
                $this->error = array(
                    "code" => "2001",
                    "message" => "Foreignkeys can't be empty!",
                );
                return false;
            }
        }
        return true;
    }

    /**
     * Deletes all objects from the database that have an valid id.
     * @return boolean - if returned false check the getError function for the
     * errormessage.
     */
    public function delete($connection = null) {
        if ($connection == null) {
            return false;
        }
        if ($this->validate() === false) {
            return false;
        }

        
        $primaryKeys = array();
        $foreignKeys = array();

        if(!$this->arePrimarykeysSet($primaryKeys) || !$this->areForeignkeysSet($foreignKeys)){
            return false;
        }

        $params = array();
        $where = "";
        
        foreach ($primaryKeys as $columnName => $value) {
            $where .= ($where != "" ? " and " : "") . $columnName . "=?";
            $params[] = $value;
        }
        
        foreach ($foreignKeys as $columnName => $value) {
            $where .= ($where != "" ? " and " : "") . $columnName . "=?";
            $params[] = $value;
        }

        //There must be somekind of value in the id field... else all objects are deleted...
        if ($where != "") {
            $query = "delete from " . $this->mapping->tablename . " where " . $where;
            if ($connection->dbPreparedStatement($query, $params)) {
                return true;
            } else {
                $this->error = $connection->getError();
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     *
     */
    public function get($connection = null, array $identifiers, array $receiveColumns = null ) {
        //Open database connection
        if ($connection == null) {
            return false;
        }

        $select = "";
        $where = "";
        $params = array();
        
        if ($receiveColumns != null) {
            foreach ($receiveColumns as $columnName) {
                if (array_key_exists($columnName, $this->mapping->columns)) {
                    
                    $select .= ($select != "" ? ", " : "") . $this->mapping->tablename . "." . $columnName;
                }
            }
        } else {
            $select = "*";
        }

        $this->getWhereClause($where, $params, $identifiers);

        $query = "select " . $select . " from " . $this->mapping->tablename . ($where == "" ? "" : (" where " . $where));

        //If the query succeeds       
        if ($connection->dbPreparedStatement($query, $params, "select") !== false) {
            $records = $connection->getFetchData();
            if (count($records) != 0 && $this->handleResult($receiveColumns, $records[0])) {
                return true;
            } else {
                $this->error = array(
                    "code" => "2000",
                    "message" => "Er is geen object gevonden in de database!",
                );
                return false;
            }
        } else {
            $this->error = $connection->getError();
            return false;
        }
    }

    private function handleResult($receiveColumns, $record) {
        if ($records == null) {
            return false;
        }
        
        $receiveColumns = $this->switchKeyValueMap($receiveColumns);
        
        foreach ($record as $columnKey => $columnValue) {
            
            if (($receiveColumns == null || array_key_exists($columnKey, $receiveColumns))) {
                switch( $this->mapping->columns[$columnKey]->columnType){
                    case "integer":
                        $this->$columnKey = (int)$columnValue;
                        break;
                    case "double":
                        $this->$columnKey = (double)$columnValue;
                        break;
                    case "datetime":
                        $d = new \DateTime($columnValue);
                        $this->$columnKey = $d->format(\DateTime::W3C);
                        break;
                    case "date":
                        $d = new \DateTime($columnValue);
                        $this->$columnKey = $d->format(\DateTime::W3C);
                        break;
                    case "boolean":
                        $this->$columnKey = (bool)$columnValue;
                        break;
                    default:
                        $this->$columnKey = $columnValue;
                        break;
                }
                
            }
            
        }
    }


    /**
     *
     * @return type
     */
    private function switchKeyValueMap($array) {
        if ($array == null) {
            return null;
        }
        $m = array();
        foreach ($array as $field => $column) {
            $m[$column] = $field;
        }
        return $m;
    }

    /**
     *
     * @param type $where
     * @param type $params
     * @param type $operators
     * @param String $prefix - a string that functions as a prefix before the columnname
     */
    public function getWhereClause(&$where, &$params, array $identifiers) {
        $prefixStr = ($prefix != null) ? $prefix : $this->mapping->tablename;

        foreach ($identifiers as $identifier) {
            if (array_key_exists($identifier, $this->mapping->columns)) {
                
                $where .= ($where != "" ? " and " : "") . $prefixStr . "." . $identifier . "=?";
                $params[] = $this->{$identifier};
            }
        }

        /*foreach ($this->mapping->columns as $columnName => $column) {
            
                
                    $where .= ($where != "" ? " and " : "") . $prefixStr . "." . $columnName . "=?";
                    $params[] = $this->{$columnName};
                
            
        }*/
        
    }

    /**
     * If you want to add a "in" in your sql statement.
     * @param type $columnName - name of the column
     * @param type $array - a array of values.
     * @return boolean - returns false if its an invalid columnname
     */
    public function setIn($columnName, $array) {

        if (array_key_exists($columnName, $this->mapping->columns)) {
            if ($array != null) {
                $this->in[] = array("columnName" => $columnName, "values" => $array);
            }
        } else {
            return false;
        }

        return true;
    }

    /**
     *
     * @return type
     */
    private function createBaseObject($receiveColumns) {
        $baseClass = get_class($this);
        $baseObject = new $baseClass();
        if ($receiveColumns != null) {
            foreach ($baseObject as $field => $value) {
                if (!array_key_exists($field, $receiveColumns)) {
                    unset($baseObject->$field);
                }
            }
        }
        return $baseObject;
    }

    /**
     * Never print this error directly to the screen unless you are sure that it's save
     * It contains the tracelog (that can hold the sql query)
     *
     * All codes below 2000 are sql codes. From 2000 the codes are project specific
     *
     * code 2000 = Er is geen object gevonden in de database!
     * code 2001 = De foreignkeys moeten zijn gevuld.
     * code 2002 = Er moet minimaal één waarde worden opgeslagen
     * code 2003 = Er kan alleen een delete worden uitgevoerd als het id gevuld is!
     *
     * @return type
     */
    public function getError() {
        return $this->error;
    }

}

/**
 *
 */
class AppendType {

    public $table;
    public $where;
    public $params;

    function __construct($table, $where, $params) {
        $this->table = $table;
        $this->where = $where;
        $this->params = $params;
    }

}

?>
