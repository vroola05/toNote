<?php
namespace core\db;

use \core\db\ModelBase;

class Collection {

    private $connection;
    private $tableObjects;
    private $columnMap;
    //
    private $prefixCounter = 0;
    //
    private $foreignKeyBindings;

    function __construct() {

    }

    /**
     *
     * @param ModelBase $tableObject - A table object of the type ModelBase
     * @param array $requestedFields - The collumns that you want to receive
     * @param String $name - (optional) the name of the object that is returned after you call the get method.
     *
     * @return String Description
     */
    function addTable(ModelBase $tableObject, array $requestedFields, string $name = null) {
        //Get a letter prefix
        $prefix = "p" . $this->prefixCounter++;

        $tableName = $tableObject->getTableName();
        $mapping = $tableObject->getMapping();

        if ($requestedFields != null) {
            foreach ($requestedFields as $key => $columnName) {
                $this->columnMap[$columnName][$prefix] = new CollectionType( $tableName, ($name != null) ? $name : $tableName, $columnName, $prefix, $name);
            }
        } else {

        }
        //De naam van de klasse wordt de koppeling
        $this->tableObjects[$tableName][$prefix] = $tableObject;

        return $prefix;
    }

    /**
     * (OPTIONAL) Bind a specific table to a foreign key - for examble if you have two relationships to the same table on different collumns. Alway put
     * the binding on the table that has the forein key. For example if i have two tables A and B and i hava created a foreign key on B.id than de code should be
     * bindForeignKeys('id', 'B', 'A'). The prefix of the tables is returned by the function addTable(), so you need to first add the tables to the collection
     * before you can bind them. You only need to bind specific columns if you have two collumns that have foreign keys on the same table.
     *
     * @param String $columnNameParent - the name of te column that has the forein key
     * @param String $prefixParent - the prefix of the table that has te forein key
     * @param String $prefixChild - the prefix of the table that you want to bind
     * @param String $prefixChild - the prefix of the table that you want to bind
     * @param String $prefixChild - the prefix of the table that you want to bind
     */
    function bindForeignKeys( string $columnNameParent, string $prefixParent, string $columnNameChild, string $prefixChild, string $operator = null) {
        if ($this->foreignKeyBindings == null) {
            $this->foreignKeyBindings = array();
        }
        if (!array_key_exists($columnNameChild, $this->foreignKeyBindings)) {
            $this->foreignKeyBindings[$columnNameChild] = array(); //
        }
        if (!array_key_exists($prefixChild, $this->foreignKeyBindings[$columnNameChild])) {
            $this->foreignKeyBindings[$columnNameChild][$columnNameParent] = array();
        }

        $this->foreignKeyBindings[$columnNameChild][$prefixChild][$columnNameParent] = array("operator" => $operator, "prefixParent" => $prefixParent);
    }

    function reset() {
        $this->tableObjects = null;
        $this->columnMap = null;
        $this->prefixCounter = 0;
        $this->foreignKeyBindings = null;
    }

    /**
     *
     * @param type CollectionParams $collectionParameters - (OPTIONAL) An object that contains the options like sorting or distinct
     * @param type Database $connection - (OPTIONAL) It is possible to pass a connection on to this function. For speeding up if you need to make multiple calls
     * to the database
     * @return array - The return type either consists out of a flat table or json objects. A flat table is much faster than the json objects, but for small lists, it is posible.
     */
    function get(CollectionParams $collectionParameters = null, Database $connection = null) : array{
        if ($collectionParameters == null) {
            $collectionParameters = new CollectionParams();
        }

        //Open database connection
        if ($connection == null) {
            $this->connection = Database::getInstance();
            $this->connection->dbConnect();
        } else {
            $this->connection = $connection;
        }

        $output = array();

        $select = "";
        $tables = "";

        $where = "";
        $params = array();

        //////////////////////////////////////////////
        // Walk through the list of collumns and add them to the select clause
        //////////////////////////////////////////////
        if ($this->columnMap != null) {

            $hasDistinct = false;
            $distinct = "";

            if ($collectionParameters->distinct != "") {
                $hasDistinct = true;
                $distinct = $collectionParameters->distinct;
            }

            foreach ($this->columnMap as $columnName => $templateTypeContainer) {
                foreach ($templateTypeContainer as $prefix => $templateType) {
                    if ($hasDistinct && $distinct == $columnName) {
                        $select = "DISTINCT(" . $prefix . "." . $columnName . ") as " . ($templateType->columnPrefix == null ? "" : $templateType->columnPrefix) . $columnName . ($select != "" ? ", " : "") . $select;
                    } else {
                        $select .= ($select != "" ? ", " : "") . (($templateType->columnPrefix == null) ? $prefix . "." . $columnName : $prefix . "." . $columnName . " as " . $templateType->columnPrefix . $columnName);
                    }
                }
            }
        }

        //////////////////////////////////////////////
        // Add the options after the where clause
        //////////////////////////////////////////////
        $options = "";
        $combined = false;

        //////////////////////////////////////////////
        // SORTING
        //////////////////////////////////////////////
        if ($collectionParameters->order) {
            //////////////////////////////////////////////
            // Loop through the order array
            //  - First Check if the column exists
            //  - Second Check if a prefix is given (optional) a prefix is like a.id ... the a. is the prefix
            //  - Third Check if a type is given. A type is a function to sort for example on date.. Example: order by year(a.id) desc
            //  - Fourth If no prefix is given, just add order on all columns found with the specific name
            //////////////////////////////////////////////
            foreach ($collectionParameters->order as $order) {
                $columnName = $order["columnName"];
                if (array_key_exists($columnName, $this->columnMap)) {
                    if (array_key_exists($order["prefix"], $this->columnMap[$columnName])) {
                        if ($order["type"] != null) {
                            $options .= ($options != "" ? ", " : "") . $order["type"] . "(" . $order["prefix"] . "." . $columnName . ") " . $order["order"];
                        } else {
                            $options .= ($options != "" ? ", " : "") . $order["prefix"] . "." . $columnName . " " . $order["order"];
                        }
                    } else {
                        foreach ($this->columnMap[$columnName] as $prefix => $column) {
                            if ($order["type"] != null) {
                                $options .= ($options != "" ? ", " : "") . $order["type"] . "(" . $prefix . "." . $columnName . ") " . $order["order"];
                            } else {
                                $options .= ($options != "" ? ", " : "") . $prefix . "." . $columnName . " " . $order["order"];
                            }
                        }
                    }
                }
            }
            $options = " order by " . $options;
        }

        //////////////////////////////////////////////
        // RANGE - FROM AND AMOUNT
        //////////////////////////////////////////////
        if ($collectionParameters->amount) {
            $options .= " limit ";
            if ($collectionParameters->from != null) {
                $options .= $collectionParameters->from . ", ";
            }
            $options .= ($collectionParameters->amount + $collectionParameters->from);
        }
        //////////////////////////////////////////////
        // RETURN ALL AS COMBINED ARRAY
        //////////////////////////////////////////////
        if ($collectionParameters->combined) {
            $combined = $collectionParameters->combined;
        }

        //////////////////////////////////////////////
        // ENABLE DIFFERENT OPERATORS ON GIVEN COLUMNS
        //////////////////////////////////////////////
        $operators = null;
        if ($collectionParameters->operators != null) {
            $operators = $collectionParameters->operators;
        }

        //////////////////////////////////////////////
        // Loop through the tables
        //  - First add the where clause
        //  - Second add all the foreing key that have no binding
        //////////////////////////////////////////////
        foreach ($this->tableObjects as $tableName => $tableObjectContainer) {

            foreach ($tableObjectContainer as $prefix => $tableObject) {
                $tables .= ($tables != "" ? ", " : "") . $tableName . " " . $prefix;
                $tableObject->getWhereClause($where, $params, $operators, $prefix);
                $foreignKeys = $tableObject->getForeignKeys();
                foreach ($foreignKeys as $columnName => $foreignKey) {
                    //Otherwise just asume that there is just one foreinkey and add that
                    if (array_key_exists($foreignKey->tableName, $this->tableObjects)) {
                        foreach ($this->tableObjects[$foreignKey->tableName] as $fPrefix => $fTable) {
                            if (
                                    $this->foreignKeyBindings == null ||
                                    !array_key_exists($foreignKey->columnNameParent, $this->foreignKeyBindings) ||
                                    (
                                    array_key_exists($foreignKey->columnNameParent, $this->foreignKeyBindings) &&
                                    !array_key_exists($fPrefix, $this->foreignKeyBindings[$foreignKey->columnNameParent])
                                    )
                            ) {
                                $where .= ($where != "" ? " and " : "") . $fPrefix . "." . $foreignKey->columnNameParent . "=" . $prefix . "." . $columnName;
                            }
                        }
                    }
                }
            }
        }
        //////////////////////////////////////////////
        // Add all the foreign keys that have a binding
        //////////////////////////////////////////////
        if ($this->foreignKeyBindings != null) {
            $whereOr = "";

            foreach ($this->foreignKeyBindings as $columnNameChild => $binding) {
                foreach ($binding as $prefixChild => $bindingParent) {
                    foreach ($bindingParent as $columnNameParent => $column) {
                        if ($column["operator"] == "or") {
                            $whereOr .= ($whereOr != "" ? " or " : "") . $prefixChild . "." . $columnNameChild . "=" . $column["prefixParent"] . "." . $columnNameParent;
                        } else {
                            $where .= ($where != "" ? " and " : "") . $prefixChild . "." . $columnNameChild . "=" . $column["prefixParent"] . "." . $columnNameParent;
                        }
                    }
                }
            }
            if ($whereOr != "") {
                $where .= ($where != "" ? " and " : "") . "(" . $whereOr . ")";
            }
        }
        $query = "select " . $select . " from " . $tables . ($where != "" ? " where " . $where : "") . $options;
        if ($this->connection->dbPreparedStatement($query, $params)) {
            $records = $this->connection->getFetchData();
            //$output = $records;
            print_r($this->columnMap);
            foreach ($records as $record) {
                foreach ($record as $columnKey => $columnValue){
                    //print_r($columnKey. " ". $columnValue . "\n");

                }
            }
        }

        //Close database connection
        if ($connection == null) {
            $this->connection->dbClose();
        }
        $this->reset();

        return $output;
    }

}

class CollectionType {
    public $tableName;
    public $assignedPrefix;
    public $columnPrefix;
    public $objectName;
    public $field;

    /**
     *
     * @param type $tableName - The name of the table
     * @param type $objectName
     * @param type $field
     * @param type $assignedPrefix - (optional) A prefix before a columnname - for example a.name of b.firstname
     */
    function __construct( string $tableName, string $objectName, string $field, string $assignedPrefix = null, string $columnPrefix = null) {
        $this->tableName = $tableName;
        $this->objectName = $objectName;
        $this->field = $field;
        $this->assignedPrefix = $field;
        $this->columnPrefix = $columnPrefix;
    }

}

?>
