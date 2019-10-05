<?php
namespace core;

abstract class Lang {
    private static $LANGUAGE = null;

    public static function read(){
        $strJsonFileContents = file_get_contents("config/language.json");
        Lang::$LANGUAGE = json_decode($strJsonFileContents, true);
    }
}
?>