<?php
namespace core;

abstract class Http {
    const CONTENT_TYPE_TEXT = "text/plain";
    const CONTENT_TYPE_JSON = "application/json";
    const CONTENT_TYPE_APPLICATION_XML = "application/xml";
    const CONTENT_TYPE_TEXT_XML = "text/xml";
    const CONTENT_TYPE_HTML = "text/html";
    const CONTENT_TYPE_FORM = "application/x-www-form-urlencoded";

    const HTTP_METHOD_GET = "GET";
    const HTTP_METHOD_POST = "POST";
    const HTTP_METHOD_PUT = "PUT";
    const HTTP_METHOD_DELETE = "DELETE";
    
    /**
     * 
     */
	function  __construct(){
    }


    public static function getHeader(string $name){
        foreach (getallheaders() as $key => $value) {
            if($name==$key) return $value;
        }
    }

    /**
     * Sets the status of the response.
     *
     * @param integer $status a valid http-status
     */
    public static function setStatus($status){
        http_response_code($status);
    }

    /**
     * This function sends the returned data back to the client computer.
     *
     * @param object $content any data you want to send back to the client
     * @param string $contentType the response contenttype if left empty the contenttype will be application/json but the data won't be encoded
     */
    public static function remand($content, $contentType=null){
        Security::defaultHeaders();
        
        if($contentType!=null){
            header('Content-Type: ' . $contentType);    
        }else{
            header('Content-Type: ' . Http::CONTENT_TYPE_JSON);
        }

        switch($contentType){
            case Http::CONTENT_TYPE_JSON:
                print(Http::__parseJsonData($content));
                break;
            default:
                print($content);
                break;
        }
    }

    /**
     * return any content that is send by an update or a post
     *
     * @param string $contentType the contenttype of the request
     */
    public static function getContent($contentType=null) {
        
        $put = fopen('php://input', 'r');
        if($put===false){
            return null;
        }else{
            $data = "";
            while ($o = fread($put, 1024)) {
                $data .= $o;
            }
            fclose($put);
            
            if(!array_key_exists ("CONTENT_TYPE",$_SERVER) || $contentType != $_SERVER["CONTENT_TYPE"]) return null;
            
            if( $contentType==Http::CONTENT_TYPE_JSON ){
                return \json_decode($data);
            }

            return $data;
        }
    }

    /**
     * Internal function that tries to encode the given content to a valid json encoded string.
     * 
     * @param string $content a json object
     */
    private static function __parseJsonData($content){
        $data = \json_encode($content);
        if($data===false){
            Http::setStatus(500);
            return \json_encode(new Message(500, "Oops someting went wrong!"));
        }else{
            return $data;
        }
    }
}
?>