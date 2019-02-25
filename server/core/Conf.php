<?php
namespace core;

abstract class Conf {
    private static $CONFIG = null;
        
    /**
     * 
     */
	function  __construct(){
    }


    public static function get(string $name){
        
        if(array_key_exists ($name, Conf::$CONFIG)){
            return Conf::$CONFIG[$name];
        }
        throw new \Exception("Invalid key {$name} config!");
    }

    public static function read(){
        if(Conf::$CONFIG == null){
            try{
            $ini = parse_ini_file("config/conf.ini");
            if($ini===false){ 
                throw new \Exception("No config file!");
            }
            Conf::$CONFIG = $ini;
            }catch(\Exception $e){
                throw new \Exception("No config file!");
            }
        }
    }
}
?>