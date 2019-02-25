<?php
namespace core\db;

/**
 * The mapping is used to link php objects to the database.
 */
class Mapping {

    public $tablename;
    public $columns;
    public $primaryKeys;
    public $foreignKeys;

    function __construct( string $tablename ) {
        $this->tablename = $tablename;
        $this->columns = array();
        $this->primaryKeys = array();
        $this->foreignKeys = array();
    }

    /**
     * Map a column in the database and link it to a variabele in the php object
     * @param type $columnName - columnname in the database
     * @param type $columnType - database types. Suported values are:
     *   - string
     *   - boolean
     *   - integer
     *   - double
     *   - date
     *   - datetime
     *   - blob
     * @param type $field - name of the variable in the php object
     * @param type $validate - validate on extra parameters. Posible values are:
     *  - email
     *  - phone
     *  - postal
     *  - password
     * @param type $length - the maximum length if the string
     */
    function addColumn( string $columnName, string $columnType, string $validate = null, string $length = null ) {
        $this->columns[$columnName] = new MappingColumnTypes( $columnType, $validate, $length, null);
    }

    /**
     * Optionaly - you can set the forein key
     * @param type $tablename - Name of the table that is its parent
     * @param type $columnNameParent - Name of the column of the parent
     * @param type $columnName - Name of the column that contains the foreign key
     */
    function addForeignKey( string $tablename, string $columnNameParent, string $columnName) {
        $this->foreignKeys[$columnName] = new MappingKeyTypes($columnNameParent, $tablename);
    }

    /**
     * Link the object variable to the id in the database.
     * @param type $columnName - The name of the column in the database
     * @param type $field - The name of the objects variable
     */
    function addPrimaryKey( string $columnName, string $field) {
        $this->primaryKeys[$columnName] = $field;
    }

}

/**
 *
 */
class MappingKeyTypes {

    public $columnNameParent;
    public $tableName;

    function __construct( string $columnNameParent, string $tableName) {
        $this->columnNameParent = $columnNameParent;
        $this->tableName = $tableName;
    }

}

/**
 * Contains the columnname and type of a databaserecord.
 * Those two are linked to a variable in a php object
 */
class MappingColumnTypes {
    public $columnType;
    public $validate;
    public $length;

    function __construct( string $columnType, string $validate = null, int $length = null) {
        $this->columnType = $columnType;
        $this->validate = $validate;
        $this->length = $length;
    }

}
