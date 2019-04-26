<?php
namespace core;

class Router {

    private static $tree = null;

    /**
     * 
     */
	function  __construct(){
    }

    /**
     * Creates a rest-api from the routes given as parameter. Every path is linked to a specific funtion.
     * 
     * array( 
	 *		"/PATH" => array( 
	 *			"GET" => array("CLASS", "FUNCTION", RESPONSE_CONTENTTYPE)
	 *		),
	 *		"/PATH/{string}" => array( 
	 *			"GET" => array("CLASS", "FUNCTION", RESPONSE_CONTENTTYPE)
	 *		),
	 *		"/PATH/{string}/{number}" => array( 
	 *			"GET" => array("CLASS", "FUNCTION", RESPONSE_CONTENTTYPE),
	 *			"PUT" => array("CLASS", "FUNCTION", REQUEST_CONTENTTYPE, RESPONSE_CONTENTTYPE),
	 *			"POST" => array("CLASS", "FUNCTION", REQUEST_CONTENTTYPE, RESPONSE_CONTENTTYPE)
     *		)
     * )
     */
    public static function create($routes){
        Router::$tree = array();
        //Loop through a list of routes to create a map containing al paths
        foreach($routes as $route => $value) {
            //Strip the first backslash
            $index=strpos($route, "/");
            if($index !== false && $index==0)$route=substr($route,1);

            //Create an array of all keywords
            Router::$tree = Router::__parseRoute(explode('/', $route), $value, Router::$tree);
        }
    }

    /**
     * Returns if the map already is created
     */
    public static function exist(){
        if(Router::$tree==null)
            return false;
        return true;
    }

    /**
     * Routes to the path given in the url
     */
    public static function route(){
        try{
            Router::__routeURL(Router::__getPath());
        }catch(\Exception $e){
            throw $e;
        }
    }

    /**
     * This recursive function creates a map of all posible paths
     */
    private static function __parseRoute($route, $value, $tree){
        $key = "/".array_shift($route);
        if(!array_key_exists($key, $tree)){
            $tree[$key] = array();
        }

        if(count($route)>0){
            $tree[$key] = Router::__parseRoute($route, $value, $tree[$key]);
        }else{
            $tree[$key]["__route"]= $value;
        }
        return $tree;
    }

    /**
     * Receives the path from the url
     */
    private static function __getPath(){
        $path = utf8_decode(
            substr(
                urldecode(
                    explode('?', filter_var($_SERVER['REQUEST_URI'], FILTER_SANITIZE_STRING))[0]
                ), strlen(rtrim(dirname($_SERVER['SCRIPT_NAME']), '\/')) + 1));
        if ($path == basename($_SERVER['PHP_SELF'])) {
            $path = "";
        }
        return explode('/', $path);
    }

    /**
     * Routes a specific path to a function given in the routes. This is a recursive function 
     * 
     * @param string $parts - an array containing the path (from the URL)
     * @param array $tree - default value is null
     * @param array $values - default value = array()
     * @param array $index - default value is 0
     * @param array $size - default value is 0
     */
    private static function __routeURL($parts, $tree=null, $values=array(), $index=0, $size=0) : bool {
        if (!is_array($parts)){
            throw new \Exception('Oops something went wrong!');
        }

        //If this the first item in the path get the Router::$tree as base
        $branch = null;
        if($tree!=null){
            $branch = $tree;
        } else {
            $branch = Router::$tree;
            $size=count($parts);
        }

        //Get the first item from the path
        $part = $parts[$index];
        
        //first check if the path-item exists in the branch
        if(array_key_exists ("/".$part, $branch)){
            return Router::__r($parts, $branch["/".$part], $values, $index, $size);
        //Else check if the next item in the path is a string or a number
        }else{
            foreach($branch as $key => $value) {
                switch($key){
                    case "/{number}":
                        if(Router::__isNumber($part)){
                            array_push($values, $part);
                            return Router::__r($parts, $branch["/{number}"], $values, $index, $size);
                        } else throw new \Exception('Invalid path!');
                        break;
                    case "/{string}":
                        if(Router::__isString($part)){
                            array_push($values, $part);
                            return Router::__r($parts, $branch["/{string}"], $values, $index, $size);
                        } else throw new \Exception('Invalid path!');
                        break;
                    default:
                        break;
                }
                
            }
        }
        return false;
    }

    /**
     * Recursive function that either calls the function given in the route or follows the next item in the path
     * 
     * @param string $parts - 
     * @param array $branch - 
     * @param array $values - 
     * @param array $index - 
     * @param array $size - 
     */
    private static function __r($parts, array $branch, $values, $index, $size){
        if(is_array($branch)){
            if($index+1 < $size){
                return Router::__routeURL($parts, $branch, $values, $index+1, $size);
            }else if(array_key_exists ("__route", $branch)){
                if(array_key_exists ($_SERVER['REQUEST_METHOD'], $branch["__route"])){
                    return Router::_call($_SERVER['REQUEST_METHOD'], $branch["__route"][$_SERVER['REQUEST_METHOD']], $values);
                }else {
                    //throw new \Exception();    
                    Router::throwException(400, 'Invalid method!');
                    return false;
                    
                }
            }else {
                Router::throwException(400, 'Oops something went wrong!');
                return false;
            }
        }else {
            Router::throwException(400, 'Oops something went wrong!');
            return false;
        }
    }

    /**
     * Calls the function given in the route.
     * 
     * @param string $method - a http method GET, POST, PUT, DELETE
     * @param array $obj - if method is GET: array("CLASS", "FUNCTION", "RESPONSE_CONTENTTYPE") else if method is POST, PUT: array("CLASS", "FUNCTION", "REQUEST_CONTENTTYPE", "RESPONSE_CONTENTTYPE")
     * @param array $values - possible path values given wrapped in an array
     */
    private static function _call( string $method, array $obj, array $values ){
        $result = null;
        $reqContentType = null;
        $respContentType = null;
        try{
            $class = null;
            $function = null;
            //The first two values will contain the name of the class and the name of the function
            if( count($obj)>=2 && $obj[0]!=null && $obj[0]!="" && $obj[1]!=null && $obj[1]!="" ) {
                $class = new $obj[0];
                $function = $obj[1];
            } else {
                Router::throwException(400, 'Oops something went wrong!');
                return false;
            }
            
            if( $method == Http::HTTP_METHOD_GET ){
                if(count ($obj) > 2) {
                    $respContentType = $obj[2];
                } else {
                    Router::throwException(400, 'Oops something went wrong!');
                    return false;
                }
                $result = call_user_func(array(new $class(), $function), $values);
            } else if( $method== Http::HTTP_METHOD_POST || $method==Http::HTTP_METHOD_PUT ){
                if(count ($obj) > 3 ) {
                    $reqContentType = $obj[2];
                    $respContentType = $obj[3];
                } else {
                    Router::throwException(400, 'Oops something went wrong!');
                    return false;
                }
                $result = call_user_func(array(new $class(), $function), $values, Http::getContent($reqContentType));
            } if( $method== Http::HTTP_METHOD_DELETE ){
            }
            Http::remand($result, $respContentType);
            return true;
        } catch(\Exception $e){
            $status = http_response_code();
            if($status>=200&&$status<300)
                $status=500;
            Router::throwException($status, $e->getMessage());
            return false;
        }

    }

    /**
     * Returns an exception to the client
     * 
     * @param integer $status a valid http-status
     * @param string $message the message to return
     */
    public static function throwException($status, $message){
        Http::setStatus($status);
        Http::remand(new Message($status, $message), Http::CONTENT_TYPE_JSON);
    }
    
    /**
     * true if the value is a number
     */
    private static function __isNumber($value){
        return is_numeric($value);
    }

    /**
     * true if the value is a string
     */
    private static function __isString($value){
        return true;
    }
}

?>