<?php
namespace core\db;

/**

 */
class ModelBase {

    private $error; //Stores any sql error
    private $messages; //Stores validation errors
    private $mapping; //Stores the mapping to the database    
    private $isfieldSet;
    private $in;

    function __construct() {

    }

    public function set($json) {
        if ($json != null) {
            foreach ($json as $key => $value) {
                $this->setVar($key, $value);
            }
        }
    }

    public function setVar($field, $value) {
        $this->{$field} = $value;
        if ($this->isfieldSet == null)
            $this->isfieldSet = array();
        $this->isfieldSet[$field] = $value;
    }

    public function validate() {
        $validator = new Validator();
        $this->messages = array();

        foreach ($this->mapping->primaryKeys as $fieldName) {
            if (!$this->$fieldName == null && !ctype_digit((string) $this->$fieldName)) {
                $fault = new Fault();
                $fault->setId($fieldName);
                $fault->setFaultcode("Het veld mag alleen een geheel getal bevatten!: " . $this->$fieldName);
                $this->messages[] = $fault;
            }
        }
        foreach ($this->mapping->columns as $column) {
            $value = $this->{$column->field};
            $faultcode = null;
            if ($value != null && $value != "") {
                switch ($column->columnType) {
                    case "string":
                        if (!is_string($value)) {
                            $faultcode = "Het veld bevat geen tekstuele waarde!";
                        }
                        break;
                    case "boolean":
                        if (!is_bool($value) && $value != "1" && $value != "0") {
                            $faultcode = "Het veld mag alleen de waarde waar of onwaar bevatten!";
                        }
                        break;
                    case "integer":
                        if (!ctype_digit((string) $value)) {
                            $faultcode = "Het veld mag alleen een geheel getal bevatten!: " . $value;
                        }
                        break;
                    case "double":
                        if (!is_numeric($value)) {
                            $faultcode = "Het veld mag alleen een getal bevatten!";
                        }
                        break;
                    case "date":
                        if (!$validator->checkSqlDate($value, 'Y-m-d')) {
                            $faultcode = "De datum staat niet in de goede volgorde. Het juiste formaat is: yyyy-mm-dd!";
                        }
                        break;
                    case "datetime":
                        if (!$validator->checkSqlDate($value, 'Y-m-d H:i:s')) {
                            $faultcode = "De datum " . $value . " staat niet in de goede volgorde. Het juiste formaat is: yyyy-mm-dd hh:mm:ss!";
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
                                $faultcode = "Er zit een fout in het mailadres!";
                            }
                            break;
                        case "phone":
                            if (!$validator->checkPhone($value)) {
                                $faultcode = "Er zit een fout in het telefoonnummer!";
                            }
                            break;
                        case "postal":
                            if (!$validator->checkPostal($value)) {
                                $faultcode = "Er zit een fout in de postcode!";
                            }
                            break;
                        case "password":
                            if (!$validator->checkPassword($value)) {
                                $faultcode = "Het wachtwoord is niet sterk genoeg!";
                            }
                            break;
                        default :
                            break;
                    }
                }
                if ($column->length != null) {
                    if (strlen($value) > $column->length) {
                        $faultcode = "Het veld mag maximaal " . $column->length . " tekens bevatten!";
                    }
                }
                if ($faultcode != null) {
                    $fault = new Fault();
                    $fault->setId($column->field);
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

    /**
     * Saves an object to the database. If the object has a primary key that is not null
     * it does an update, else it insert the object
     * @param type $parentId - The parentId is only used for inserts. For every
     * update an id needs to exist, and is must contain a value you can map the
     * id using the Mapping::addId function
     * @return boolean - if returned false check the getError function for the
     * errormessage.
     */
    public function put($connection = null) {
        if ($this->validate() == false)
            return false;

        $output = null;

        if ($connection == null) {
            return false;
        }

        $params = array();
        $query = "";
        $where = "";

        $primaryKeys = array();

        $hasPrimaryKey = true;
        foreach ($this->mapping->primaryKeys as $columnName => $fieldName) {
            $primaryKeys[$columnName] = $this->$fieldName;
            //a zero is threated as empty so i added !is_numeric
            if (!isset( $primaryKeys[$columnName] ) || (empty($primaryKeys[$columnName]) && !is_numeric($primaryKeys[$columnName]))) {
                $hasPrimaryKey = false; //insert..
            } else {
                $where .= ($where != "" ? " and " : "") . $columnName . "=?";
                $params[] = $primaryKeys[$columnName];
            }
        }

        $hasForeinKey = false;
        foreach ($this->mapping->foreignKeys as $columnName => $foreignKey) {
            $field = $this->mapping->columns[$columnName]->field;

            if (!array_key_exists($field, $this->isfieldSet)) {
                $this->error = array(
                    "code" => "2001",
                    "message" => "De foreignkeys moeten zijn gevuld.",
                );
                $output - false;
            } else {

                $hasForeinKey = true;
                if (!array_key_exists($columnName, $this->mapping->primaryKeys)) {
                    $where .= ($where != "" ? " and " : "") . $columnName . "=?";
                    $params[] = $this->$field;
                }
            }
        }

        //If there are records found, there need to be a check if the record needs to be updated or inserted.
        if ($hasForeinKey && $hasPrimaryKey) {
            $query = "select count(*) as amount from " . $this->mapping->tablename . " where " . $where;
            if ($connection->dbPreparedStatement($query, $params)) {
                $records = $connection->getFetchData();

                if ($records[0]['amount'] == 0) {
                    $hasPrimaryKey = false;
                }
            }
        }

        unset($params);
        $params = array();
        $a = "";
        $b = "";
        $hasValues = false;

        /*
         *
         * Als het een updatestatement is
         *
         */
        if ($hasPrimaryKey) {
            foreach ($this->mapping->columns as $columnName => $column) {
                if (array_key_exists($column->field, $this->isfieldSet) &&
                        !array_key_exists($columnName, $primaryKeys) &&
                        !array_key_exists($columnName, $this->mapping->foreignKeys)) {

                    $a .= ($a != "" ? ", " : "") . $columnName . "=?";
                    $params[] = $this->{$column->field};
                    $hasValues = true;
                }
            }
            foreach ($primaryKeys as $columnName => $value) {
                //because zero is seen as empty i put is_numeric in the statement
                if (isset( $primaryKeys[$columnName] ) && (!empty($primaryKeys[$columnName]) || is_numeric($primaryKeys[$columnName]))) {
                    $b .= ($b != "" ? " and " : "") . $columnName . "=?";
                    $params[] = $value;
                }
            }
            $query = "update " . $this->mapping->tablename . " set " . $a . " where " . $b;
            /**
             *
             * Als het een insertstatement is
             *
             */
        } else {
            foreach ($this->mapping->columns as $columnName => $column) {
                if (array_key_exists($column->field, $this->isfieldSet)) {
                    $a .= ($a != "" ? ", " : "") . "`" . $columnName . "`";
                    $b .= ($b != "") ? ", ?" : "?";
                    $params[] = $this->{$column->field};
                    $hasValues = true;
                }
            }
            $query = "insert into " . $this->mapping->tablename . " (" . $a . ") values (" . $b . ")";
        }

        if (!$hasValues) {
            $this->error = array(
                "code" => "2002",
                "message" => "Er moet minimaal één waarde worden opgeslagen",
            );
            $output = false;
        }
        //If the query succeeds
        else if ($connection->dbPreparedStatement($query, $params)) {
            if (!$hasPrimaryKey) {
                $output = $connection->getLastInsertId();
            } else {
                $output = true;
            }
        }
        //If the query fails
        else {
            $this->error = $connection->getError();
            $output = false;
        }
        
        return $output;
    }

    /**
     * Deletes all objects from the database that have an valid id.
     * @return boolean - if returned false check the getError function for the
     * errormessage.
     */
    public function delete($connection = null) {
        $output = true;
        //Open database connection
        if ($connection == null) {
            return false;
        }
        
        $params = array();
        $query = "";

        $where = "";

        foreach ($this->mapping->primaryKeys as $columnName => $fieldName) {
            if (isset($this->$fieldName) && (!empty($this->$fieldName) || is_numeric($this->$fieldName))) {
                $where .= ($where != "" ? " and " : "") . $columnName . "=?";
                $params[] = $this->$fieldName;
            }
        }
        if ($where == "") {
            foreach ($this->getForeignKeys() as $columnName => $fieldName) {
                if ($this->$fieldName != null ) {
                    $where .= ($where != "" ? " and " : "") . $columnName . "=?";
                    $params[] = $this->$columnName;
                }
            }
        }

        //There must be somekind of value in the id field... else all objects are deleted...
        if ($where != "") {
            $query = "delete from " . $this->mapping->tablename . " where " . $where;
            //If the query succeeds            
            if ($connection->dbPreparedStatement($query, $params)) {
                $output = true;
            }
            //If the query fails
            else {
                $this->error = $connection->getError();
                $output = false;
            }
        } else {
            $this->error = array(
                "code" => "2003",
                "message" => "Er kan alleen een delete worden uitgevoerd als primary key of de foreinkey gevuld is!",
            );
            $output = false;
        }

        return $output;
    }

    /**
     *
     */
    public function get($receiveColumns = null, $connection = null) {
        
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

        $this->getWhereClause($where, $params);

        $query = "select " . $select . " from " . $this->mapping->tablename . ($where == "" ? "" : (" where " . $where));
        //If the query succeeds
        if ($connection->dbPreparedStatement($query, $params, "select") !== false) {
            $records = $connection->getFetchData();
            if (count($records) == 0) {
                $this->error = array(
                    "code" => "2000",
                    "message" => "Er is geen object gevonden in de database!",
                );
                $output = false;
            } else {
                $output = $this->handleResult($receiveColumns, $records);
            }
        }
        //If the query fails
        else {
            $this->error = $connection->getError();
            $output = false;
        }

        return $output;
    }

    private function handleResult($receiveColumns, $records) {
        if ($records == null) {
            return null;
        }

        $receiveColumns = $this->switchKeyValueMap($receiveColumns);
        $baseObject = $this->createBaseObject($receiveColumns);

        foreach ($records as $record) {
            foreach ($record as $columnKey => $columnValue) {
                
                if (($receiveColumns == null || array_key_exists($columnKey, $receiveColumns))) {
                    switch( $this->mapping->columns[$columnKey]->columnType){
                        case "integer":
                            $baseObject->$columnKey = (int)$columnValue;
                            break;
                        case "double":
                            $baseObject->$columnKey = (double)$columnValue;
                            break;
                        case "datetime":
                            $d = new \DateTime($columnValue);
                            $baseObject->$columnKey = $d->format(\DateTime::W3C);
                            break;
                        case "date":
                            $d = new \DateTime($columnValue);
                            $baseObject->$columnKey = $d->format(\DateTime::W3C);
                            break;
                        case "boolean":
                            $baseObject->$columnKey = (bool)$columnValue;
                            break;
                        default:
                            $baseObject->$columnKey = $columnValue;
                            break;
                    }
                    
                }
            }
            return $baseObject;
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
    public function getWhereClause(&$where, &$params, $operators = null, $prefix = null) {
        $prefixStr = ($prefix != null) ? $prefix : $this->mapping->tablename;

        $whereClause = array();

        /*
         * prefix
         * columnName
         * operator
         * wildcard
         * options
         */
        foreach ($this->mapping->columns as $columnName => $column) {
            if ($this->isfieldSet != null && array_key_exists($columnName, $this->isfieldSet)) {
                if ($operators != null) {

                    if (array_key_exists($columnName, $operators) && array_key_exists($prefix, $operators[$columnName])) {

                        $op = "";
                        if (array_key_exists("operator", $operators[$columnName][$prefix])) {
                            //use the operator as index
                            $op = $operators[$columnName][$prefixStr]["operator"] == null ? "and" : $operators[$columnName][$prefixStr]["operator"];
                        } else {
                            //use the or operator as default. If there is an operator in the array, but not as string - probably only the wildcard is used
                            //so you probably wan't to search a='%bla%' or b='%bla%' or c='%bla%'
                            $op = "or";
                        }

                        if (!array_key_exists($op, $whereClause)) {
                            $whereClause[$op] = array();
                            $whereClause[$op]["where"] = "";
                            $whereClause[$op]["params"] = array();
                        }
                        //$whereClause[$op]["where"] = "";
                        //$whereClause[$op]["params"] = array();

                        if (array_key_exists("wildcard", $operators[$columnName][$prefix]) && $operators[$columnName][$prefix]["wildcard"] != null) {
                            $wildOptions = "surround";
                            if (array_key_exists("options", $operators[$columnName][$prefix])) {
                                $wildOptions = $operators[$columnName][$prefix]["options"] == null ? $wildOptions : $operators[$columnName][$prefix]["options"];
                            }
                            $wOpen = "";
                            $wClose = "";
                            $wildcard = $operators[$columnName][$prefix]["wildcard"];
                            switch ($wildcard) {
                                case "%":
                                    $wOpen = $wildOptions != "end" ? "%" : "";
                                    $wClose = $wildOptions != "start" ? "%" : "";
                                    break;
                                case "_":
                                    $wOpen = $wildOptions != "end" ? "_" : "";
                                    $wClose = $wildOptions != "start" ? "_" : "";
                                    break;
                                case "[]":
                                    $wOpen = "[";
                                    $wClose = "]";
                                    break;
                            }

                            $whereClause[$op]["where"] .= ($whereClause[$op]["where"] != "" ? " " . $op . " " : "") . $prefixStr . "." . $columnName . " like ?";
                            $whereClause[$op]["params"][] = $wOpen . $this->{$column->field} . $wClose;
                        } else {
                            $whereClause[$op]["where"] .= ($whereClause[$op]["where"] != "" ? " " . $op . " " : "") . $prefixStr . "." . $columnName . "=?";
                            $whereClause[$op]["params"][] = $this->{$column->field};
                        }
                    } else {
                        $where .= ($where != "" ? " and " : "") . $prefixStr . "." . $columnName . "=?";
                        $params[] = $this->{$column->field};
                    }
                } else {
                    $where .= ($where != "" ? " and " : "") . $prefixStr . "." . $columnName . "=?";
                    $params[] = $this->{$columnName};
                }
            }
        }
        if (count($whereClause) > 0) {
            foreach ($whereClause as $clause) {
                $where .= ($where != "" ? " and " : " ") . "(" . $clause["where"] . ")";
                $params = array_merge($params, $clause["params"]);
            }
        }

        if ($this->in != null) {
            foreach ($this->in as $in) {
                $inStr = "";
                foreach ($in["values"] as $value) {
                    $inStr .= ($inStr != "" ? ", ?" : "?");
                    $params[] = $value;
                }
                if ($inStr != "") {
                    $where .= ($where != "" ? " and " : "") . $prefixStr . "." . $in["columnName"] . " in (" . $inStr . ")";
                }
            }
        }
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
