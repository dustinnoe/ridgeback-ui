const http = require('http'),
      url = require('url'),
      fs = require('fs'),
      path = require('path'),
      api = require('./api.js')

// Configuration Variables
const uiPath = path.join(process.cwd(), '../frontend'),
      port = process.argv[2] || 19443;

// Restrict the server to ONLY these files
const files = [
    '/index.html',
    '/styles/style.css',
    '/js/index.js'
];

const fileTypes = {
    "html" : "text/html",
    "css" : "text/css",
    "js" : "text/javascript"
}

http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname,
        filename = path.join(uiPath, uri);

    var send404 = function(){
        fs.readFile(path.join(uiPath, '/404.html'), "binary", function(err, file){
            response.writeHead(404, {"Content-Type": "text/html"});
            response.write(file, "binary");
            response.end();
        });
    }

    var apiRegEx = /^\/api\/.+/
    if (apiRegEx.exec(uri)){ //test for api path
        var json = api.get(uri);
        response.writeHead(200, {"Content-Type": "application/json"});
        response.write(json);
        response.end();
        return;
    } else if (files.indexOf(uri) === -1) {
        send404();
        return;
    } else {
        fs.exists(filename, function (exists) {

            var extensionRegEx = /(?:\.([^.]+))?$/; // Capture the file extension
            var extension = extensionRegEx.exec(filename)[1];
            if (!exists || extension === undefined || !fileTypes[extension]) {
                send404();
                return;
            }

            fs.readFile(filename, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {"Content-Type": "text/html"});
                    response.write("<h1>500</h1>Unknown error\n");
                    response.end();
                    return;
                }

                response.writeHead(200, {"Content-Type": fileTypes[extension]});
                response.write(file, "binary");
                response.end();
            });
        });
    }
}).listen(parseInt(port, 10));

console.log("Server running on port " + port + "\nCTRL + C to shutdown");

