<?php
namespace core;

class Validator {

    function __construct() {

    }

    /**
     * Valideer mailadres
     * @param {type} $value
     * @returns {Boolean}
     */
    public static function checkMail($value) {
        if ($value == '' || filter_var($value, FILTER_VALIDATE_EMAIL) !== false)
            return true;
        else
            return false;
    }

    /**
     * Valideer numerieke waarde
     * @param {type} $value
     * @returns {Boolean}
     */
    public static function checkNumber($value) {
        if ($value != "" && is_numeric($value)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Valideer telefoonnummers
     * @param {type} $value
     * @returns {Boolean}
     */
    public static function checkPhone($value) {
        $exprDefault = preg_match('/0\d{9}$/', $value);
        $expr0900 = preg_match('/^090\d*$/', $value);
        $expr0800 = preg_match('/^0800\d*$/', $value);
        $expr06 = preg_match('/^06\d{8}$/', $value);
        if ($value != '' && ( $exprDefault || $expr0900 || $expr0800 || $expr06 ))
            return true;
        else if ($value == '')
            return true;
        return false;
    }

    /**
     * Valideert Nederlande postcodes
     * @param {type} $value
     * @returns {Boolean}
     */
    public static function checkPostal($value) {
        $value = str_replace(" ", "", $value);
        $value = strtolower($value);


        if ($value == '' || preg_match('/^[1-9][0-9]{3}?(?!sa|sd|ss)[a-z]{2}$/i', $value))
            return true;
        return false;
    }

    /**
     * Valideert de Datum in formaat: dd-MM-yyyy
     * @param {type} $value
     * @returns {Boolean}
     */
    public static function checkDate($value) {
        if (preg_match('/^(\d{1, 2})[-\/](\d{1, 2})[-\/](\d{4})$/', $value)) {
            $dates = explode('-', $value);
            if (checkdate($dates[1], $dates[0], $dates[2])) {
                return true;
            }
        }
        return false;
    }

    public static function checkSqlDate($date, $format = 'Y-m-d H:i:s') {
        $d = DateTime::createFromFormat($format, $date);
        return $d && $d->format($format) == $date;
    }

    /**
     * Valideert Nederlande postcodes
     * @param {type} $value
     * @returns {Boolean}
     */
    public static function checkPassword($value) {
        return true;
    }

}

?>