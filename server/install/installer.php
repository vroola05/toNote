<?php
require_once '../core/Message.php';
require_once '../core/Http.php';
require_once '../core/Router.php';
require_once '../core/GUID.php';
require_once '../core/Security.php';
require_once 'resource/ConfigResource.php';

use \core\Conf;
use \core\Http;
use \core\Security;
use \core\Router;
use \core\Message;

try{
	
	
	if(Security::cors()){
		exit(0);
	}
	
		Router::create(array( 
			"/" => array( 
				"GET" => array("Resource\ConfigResource", "get", Http::CONTENT_TYPE_JSON),
				"POST" => array("Resource\ConfigResource", "post", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON)
			),
			
		));
		Router::route();

} catch(Exception $e){
	Http::remand(new Message(500, $e->getMessage()),Http::CONTENT_TYPE_JSON);
}
?>