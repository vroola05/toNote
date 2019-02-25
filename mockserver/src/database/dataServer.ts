const DataConnector = require('./dataConnector');
import loki = require('lokijs');
import { DataServerOptions } from "./types"

var DataServer = function (options: DataServerOptions) {
	const { name, collectionNames = [] } = options

	if (!name) {
		throw new Error('the name cannot be null')
	}
		
	var db: Loki;
	const views = {}
	
	const init = () => {
		// create the database instance
		db = new loki(name, {autosave: false, verbose: false, autoload: false});

		// creates data services for the given names.
		collectionNames.filter(name => !!name).forEach(store.addCollection)

		// manually save the initial state of the store.
		store.save()		
	}


	const store: any = {
		addCollection : (name: string) => {
			if (!name) throw new Error('name cannot be null')

			const collection:Collection<any> = db.addCollection(name)	
			store[name] = new DataConnector(collection)
		},
		load : () => {						
			db.loadDatabase({}, null)		
		},
		save : () => {			
			db.saveDatabase()
		},

		$views: {}
	}

	init()
	return store
}

module.exports = DataServer;