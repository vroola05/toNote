<?php

require_once 'core/functionStore.php';
require_once 'core/Validator.php';

require_once 'core/db/Database.php';
require_once 'core/db/Mapping.php';
require_once 'core/db/ModelBase.php';

require_once 'core/Lang.php';
require_once 'core/Formatter.php';
require_once 'core/Conf.php';
require_once 'core/Message.php';
require_once 'core/Store.php';
require_once 'core/Http.php';
require_once 'core/GUID.php';

require_once 'core/Security.php';
require_once 'core/Router.php';
require_once 'dao/Dao.php';

require 'resource/LoginResource.php';
require 'resource/NotebookResource.php';
require 'resource/ChapterResource.php';
require 'resource/NotesResource.php';

use \core\Conf;
use \core\Lang;
use \core\Http;
use \core\Security;
use \core\Router;
use \core\Message;
use \core\Store;

try{
	Lang::read();
	Conf::read();
	
	new Security();	
	if(Security::cors()){
		exit(0);
	}
	else if(!Security::hasAccess()){
		$login = new Resource\LoginResource();
		$login->login(Http::getContent(Http::CONTENT_TYPE_JSON));
	}else
	{
		Router::create(array( 
			"/login" => array( 
				"GET" => array("Resource\LoginResource", "check", Http::CONTENT_TYPE_JSON)
			),
			"/logout" => array( 
				"GET" => array("Resource\LoginResource", "logout", Http::CONTENT_TYPE_JSON)
			),
			"/user" => array( 
				"GET" => array("Resource\LoginResource", "user", Http::CONTENT_TYPE_JSON)
			),
			"/user/sort/{string}" => array( 
				"PUT" => array("Resource\LoginResource", "sort", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON)
			),
			"/notebooks" => array( 
				"GET" => array("Resource\NotebookResource", "getNotebooks", Http::CONTENT_TYPE_JSON),
				"POST" => array("Resource\NotebookResource", "postNotebook", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/order/{string}" => array( 
				"GET" => array("Resource\NotebookResource", "getNotebooks", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}" => array( 
				"GET" => array("Resource\NotebookResource", "getNotebook", Http::CONTENT_TYPE_JSON),
				"PUT" => array("Resource\NotebookResource", "putNotebook", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON),
				"DELETE" => array("Resource\NotebookResource", "deleteNotebook", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/sort/{number}/{number}" =>  array( 
				"GET" => array("Resource\NotebookResource", "notebookSort", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters" => array( 
				"GET" => array("Resource\ChapterResource", "getChapters", Http::CONTENT_TYPE_JSON),
				"POST" => array("Resource\ChapterResource", "postChapter", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}" =>  array( 
				"GET" => array("Resource\ChapterResource", "getChapter", Http::CONTENT_TYPE_JSON),
				"PUT" => array("Resource\ChapterResource", "putChapter", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON),
				"DELETE" => array("Resource\ChapterResource", "deleteChapter", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/move" =>  array( 
				"GET" => array("Resource\ChapterResource", "getMoveChapterList", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/move/{number}" =>  array( 
				"GET" => array("Resource\ChapterResource", "moveChapter", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/sort/{number}/{number}" =>  array( 
				"GET" => array("Resource\ChapterResource", "chapterSort", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/notes" => array( 
				"GET" => array("Resource\NotesResource", "getNotes", Http::CONTENT_TYPE_JSON),
				"POST" => array("Resource\NotesResource", "postNote", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/notes/{number}" => array( 
				"GET" => array("Resource\NotesResource", "getNote", Http::CONTENT_TYPE_JSON),
				"PUT" => array("Resource\NotesResource", "putNote", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON),
				"DELETE" => array("Resource\NotesResource", "deleteNote", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/notes/{number}/content" => array( 
				"GET" => array("Resource\NotesResource", "getNoteContent", Http::CONTENT_TYPE_JSON),
				"PUT" => array("Resource\NotesResource", "putNoteContent", Http::CONTENT_TYPE_JSON, Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/notes/{number}/move" =>  array( 
				"GET" => array("Resource\NotesResource", "getMoveNoteList", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/notes/{number}/move/{number}" =>  array( 
				"GET" => array("Resource\NotesResource", "moveNote", Http::CONTENT_TYPE_JSON)
			),
			"/notebooks/{number}/chapters/{number}/notes/sort/{number}/{number}" =>  array( 
				"GET" => array("Resource\NotesResource", "noteSort", Http::CONTENT_TYPE_JSON)
			),
		));
		Router::route();
	}
} catch(Exception $e){
	Http::remand(new Message(500, $e->getMessage()),Http::CONTENT_TYPE_JSON);
}
?>