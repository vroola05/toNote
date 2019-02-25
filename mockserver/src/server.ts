const express = require('express');
import http = require ('http');
import bodyParser = require('body-parser');
import morgan = require('morgan');
const DataServer = require('./database/dataServer');
const RouteTable = require('./routing/routes');
const DataFactory = require('./database/data')

var server = function(){
    
    var app:any = express(); 

    // For logging purposes
    app.use(morgan('combined'))	

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // makes sure the responses are never cached
    app.use(function (req: any, res: any, next: any) {
        res.set('Content-Type', 'application/json')
        res.set('Cache-Control', 'no-cache,max-age=0')
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.header('Access-Control-Max-Age', '172000')
        next()
    })

    var port = process.env.PORT || 8080;        // set our port

    const collectionNames = DataFactory.DataFactory.map(a=> a.name);

    // create and configure the store			
    const store = DataServer({ name: 'demo.db', collectionNames });

    DataFactory.DataFactory.forEach(factory => {
        const populate = factory.populateStore;
        if(typeof populate === 'function'){
            populate(store);
        }
    });
    
    app.set("store", store)

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();              // get an instance of the express Router

    router.get('/', function(req: any, res: any) {
        res.json({ message: 'Dev server running' });   
    });

    // more routes for our API will happen here
    RouteTable.RouteTable.forEach(route => {			
        const { path, methods = {} } = route;
        
		Object.keys(methods).forEach(methodName => {
			
			const createRouteHandler = methods[methodName];		
			let routeHandler;	

			if (typeof createRouteHandler === 'function') {
				const store = app.get('store');
                routeHandler = createRouteHandler(store);
			}

			if (routeHandler) {																
				const method = methodName.toLowerCase();
				router[method](path, routeHandler);
			} 
		})
	})


    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use('/api', router);

    // START THE SERVER
    const server = http.createServer(app)
    
    // Open connections
    var openConnections: any = {};

    server.on('connection', function(con: any) {
        const key: string = con.remoteAddress + ':' + con.remotePort;
        openConnections[key] = con;
        con.on('close', function() {
            delete con[key];
        });
    });

    server.on("close", function(cb: any) {
        
        for (const key in openConnections){
            openConnections[key].destroy()
        }
        server.close(cb)
    });
    
    var port = process.env.port || 8080;
    server.listen(port, function(){
        console.log('Dev server running on port ' + port);
    });
}
module.exports = server;