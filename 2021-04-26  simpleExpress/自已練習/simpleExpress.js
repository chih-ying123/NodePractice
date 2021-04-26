const http = require('http');
const url = require('url');

function express(){

    let app = (req,res)=>{
        let reqPath = url.parse(req.url).pathname;
        let reqMethod = req.method.toLowerCase(); //toLowerCase() 字串轉為英文小寫字母
        for (let i = 0; i < app.routes.length; i++) {
            let route = app.routes[i];
            if (route.method === reqMethod && route.path === reqPath) {
                route.handler(req, res);
            }
        }
        return res.end(`can not ${reqMethod} ${reqPath}`);
    }

    app.routes = [];
    app.get = function (path, handler) {
        app.routes.push({
            method: 'get'
            , path
            , handler
        }) 
    }    
    

    app.listen = function(){
        const server = http.createServer(app)
        server.listen(...arguments);
    }

    return app ;
}

http.createServer(app);

module.exports = express;