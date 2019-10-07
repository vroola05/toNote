<?php
namespace core;

abstract class Lang {
    private static $LANGUAGE = null;

    public static function read(){
        $strJsonFileContents = file_get_contents("config/language.json");
        $lang =json_decode($strJsonFileContents, true);
        $langCode = substr($_SERVER["HTTP_ACCEPT_LANGUAGE"], 0, 2);
        if( $langCode === false || !array_key_exists($langCode, $lang)){
            $langCode = "en";
        }
        Lang::$LANGUAGE = $lang[$langCode];
    }

    /*public static function get(string $code){
        return Lang::$LANGUAGE[$code];
    }*/

    public static function get(string $text, string $param1 = null, string $param2 = null, string $param3 = null){
        if ($param3 != null){ 
            return sprintf(Lang::$LANGUAGE[$text], $param1, $param2, $param3);
        } else if ($param2 != null){ 
            return sprintf(Lang::$LANGUAGE[$text], $param1, $param2);
        } else if ($param1 != null){ 
            return sprintf(Lang::$LANGUAGE[$text], $param1);
        } 
        return Lang::$LANGUAGE[$text];
    }
}
?>