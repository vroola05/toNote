const server = require('./server')

const options = {
    'hostname': undefined,
    'path': '../client/dist',
    'port': 4400,
    // The virtual root of the webserver
    'virtual-root': '/',
    // Specifies whether 404s should return index.html
    'catch-all': true,
    // Specifies if the server should output logging information
    'verbose': true,
}

server(options)
