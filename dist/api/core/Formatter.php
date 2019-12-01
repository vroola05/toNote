<?php
namespace core;

class Formatter {
    function __construct() {
    }

    public static function w3cToSqlDate($w3cDate) {
        return (\DateTime::createFromFormat(\DateTime::W3C, $w3cDate))->format("Y-m-d H:i:s");
    }
}
?>