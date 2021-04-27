let http = require('http');
let url = require('url');


function handleRequest(req, res) {


    let reqPath = url.parse(req.url).pathname;
    let reqMethod = req.method.toLowerCase();

    console.log(reqMethod, reqPath);

    if ('get' === reqMethod && '/a' === reqPath) {
        res.end('a');
    }
    else  if ('get' === reqMethod && '/b' === reqPath) {
        res.end('b');
    }
    // .....
};

// handleRequest()


let server = http.createServer(handleRequest);

server.listen(3000);