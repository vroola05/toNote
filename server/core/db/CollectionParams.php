<?php
namespace core\db;

class CollectionParams {

    //select clause
    public $distinct;
    //where clause
    public $operators;
    //option clouse clause
    public $order;
    public $amount;
    public $from;
    //return type
    public $combined;

    /**

     *

     *
     * @param type array $options - array of posible options.
     * posible options are:
     *  key: order    Values: array of sort options
     *                   order["prefix"] Value: (OPTIONAL) Prefix or table identitier - is returned by the addTable function.
     *                   order["columnName"] Value: Name of the collumn you want to sort.
     *                   order["order"] Value: ASC - DESC
     *                   order["type"] Value: (OPTIONAL) you don't always want to order on string but also on date. Possible values are: day, mont or year.
     *  key: amount   Values: integer - amount of values you want to receive from the database
     *  key: from     Values: integer - index from where you want to start to receive the data. Example $options["from"]=10 wil return values from the 10th record til the end
     *  key: distinct Values: string - the name of a column - it is only posible to give one columnName
     *  key: combined Values: boolean - (expirimental) either return a flat table or try to create "table" objects
     *  key: operator Values: array of operator options
     *                   $operator["prefix"] - (OPTIONAL) Prefix or table identitier - is returned by the addTable function.
     *                   $operator["columnName"] - Name of the collumn you want to sort.
     *                   $operator["operator"] - Posible values: "or", "and" - the default if null is given is "and"
     *                   $operator["wildcard"] - Posible values: "%", "_", "[]"
     *                   $operator["options"] - Posible values: "start", "end", "surround"
     */
    function __construct($options = null) {
        if ($options != null) {
            if (array_key_exists("order", $options)) {
                foreach ($options["order"] as $order) {
                    $this->addSort(
                            array_key_exists("prefix", $order) ? $order["prefix"] : null, $order["columnName"], $order["order"], array_key_exists("type", $order) ? $order["type"] : null
                    );
                }
            }
            if (array_key_exists("amount", $options)) {
                $this->amount = filter_var($options["amount"], FILTER_SANITIZE_NUMBER_INT);
            }
            if (array_key_exists("from", $options)) {
                $this->from = filter_var($options["from"], FILTER_SANITIZE_NUMBER_INT);
            }

            if (array_key_exists("distinct", $options)) {
                $this->distinct = $options["distinct"];
            }
            if (array_key_exists("combined", $options)) {
                if (filter_var($options["combined"], FILTER_SANITIZE_STRING) == "false") {
                    $this->combined = false;
                }
            } else {
                $this->combined = true;
            }

            if (array_key_exists("operator", $options)) {

                if (array_key_exists("columnName", $options["operator"])) {
                    $operator = $options["operator"];
                    $this->setOperator(
                            array_key_exists("prefix", $operator) ? $operator["prefix"] : null, $operator["columnName"], array_key_exists("operator", $operator) ? $operator["operator"] : null, array_key_exists("wildcard", $operator) ? $operator["wildcard"] : null, array_key_exists("options", $operator) ? $operator["options"] : null
                    );
                } else {
                    foreach ($options["operator"] as $operator) {

                        $this->setOperator(
                                array_key_exists("prefix", $operator) ? $operator["prefix"] : null, $operator["columnName"], array_key_exists("operator", $operator) ? $operator["operator"] : null, array_key_exists("wildcard", $operator) ? $operator["wildcard"] : null, array_key_exists("options", $operator) ? $operator["options"] : null
                        );
                    }
                }
            }
        } else {
            $this->combined = true;
        }
    }

    /**
     *
     * @param type $prefix - Prefix or table identitier - is returned by the addTable function.
     * @param type $columnName - Name of the collumn you want to sort.
     * @param type $operator - Posible values: "null", "or", "and" - the default if null is given is "and"
     * @param type $wildcard - Posible values: "null", "%", "_", "[]"
     * @param type $options - Posible values: "null", "start", "end", "surround"
     */
    function setOperator($prefix, $columnName, $operator = null, $wildcard = null, $options = null) {
        //This can be userinput and needs to be filtered...
        $columnName = filter_var($columnName, FILTER_SANITIZE_STRING);
        if ($columnName === false) {
            return false;
        }

        if ($prefix == null) {
            return false;
        }

        if ($this->operators == null || !array_key_exists($columnName, $this->operators)) {
            $this->operators[$columnName] = array();
        }
        $this->operators[$columnName][$prefix] = array();

        if ($operator != null && $operator != "and" && $operator != "or") {
            return false;
        }
        $this->operators[$columnName][$prefix]["operator"] = $operator;

        if ($wildcard == "%" || $wildcard == "_" || $wildcard == "[]") {
            $this->operators[$columnName][$prefix]["wildcard"] = $wildcard;
            if ($options == "start" || $options == "end" || $options == "surround") {
                $this->operators[$columnName][$prefix]["options"] = $options;
            } else {
                $this->operators[$columnName][$prefix]["options"] = null;
            }
        } else {
            $this->operators[$columnName][$prefix]["wildcard"] = null;
        }
    }

    /**
     *
     * @param type $prefix - (OPTIONAL) Prefix or table identitier - is returned by the addTable function.
     * @param type $columnName - Name of the collumn you want to sort.
     * @param type $order - ASC - DESC
     * @param type $type - (OPTIONAL) you don't always want to order on string but also on date. Possible values are: day, mont or year.
     */
    function addSort($prefix, $columnName, $order, $type = null) {
        if ($order != "desc" && $order != "asc") {
            return false;
        }

        //This can be userinput and needs to be filtered...
        $columnName = filter_var($columnName, FILTER_SANITIZE_STRING);
        if ($columnName === false) {
            return false;
        }

        if ($prefix == null) {
//            return false;
        }

        $sort["columnName"] = $columnName;
        $sort["prefix"] = $prefix;

        //
        if ($columnName != null && strlen($columnName) < 64) {
            $sort["order"] = $order;
        } else {
            return false;
        }

        if ($type != null && $type != "day" && $type != "month" && $type != "year") {
            return false;
        }
        $sort["type"] = $type;
        $this->order[] = $sort;
    }

}

?>