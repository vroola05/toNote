const p = require('path')
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')

module.exports = (options) => {
    
    const path = options['path']
    if (!path) {
        throw new Error('Parameter "path" is required. It is the path where the production files are located.')
    }

    const publicDir = p.resolve(path)
    
    const hostname = options['hostname'] || undefined
    const port = options['port'] || 4567
    const rootUrl = options['virtual-root'] || '/'
    const catchAll = options['catch-all'] || false
    const verbose = options['verbose']
    
    const app = express()
    
    if (verbose === true) {
        app.get('*', function (req, res, next) {
            console.log(`[${new Date().toISOString()}] Request: ${req.url}`)
            next()
        })
    }
    
    app.use(cors())

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }))
    app.use(compression())
    
    app.get(rootUrl, function (req, res) {
        res.sendFile(p.join(publicDir, "/index.html"));
    }) 
    app.use(rootUrl, express.static(publicDir));
    if (catchAll) {
        app.get('*', function (req, res) {
            res.sendFile(p.join(publicDir, 'index.html'))
        })
    }
    app.use(errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    
    console.log("Static server %s listening at http://%s:%s", publicDir, hostname || '*', port);
    app.listen(port, hostname || undefined);
}
