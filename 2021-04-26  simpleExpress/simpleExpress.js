const http = require('http');
const url = require('url');

function express() {

    let app = function (req, res) {

        let reqPath = url.parse(req.url).pathname;
        let reqMethod = req.method.toLowerCase();

        let idx = 0;
        function next(){

            //console.log(app.routes.length);

            if (idx >= app.routes.length){
                return res.end(`can not ${reqMethod} ${reqPath}`);
            }
            let route = app.routes[idx++];  // 0 1 2...

            if (route.method === reqMethod && route.path === reqPath) {
                route.handler(req, res, next);
            }else{
                next();
            }           
        }
        next() ;      
    }

    app.routes = [];  // 因為有這個陣列，可以進一步控制流程  (要不要往下走)
    /*

        [
            {
              method: 'get'
                , path
                , handler
            },..... 3個
        ]

    */
    app.get = function (path, handler) {
        app.routes.push({
            method: 'get'
            , path
            , handler
        }) 
    }    

    app.listen = function (port, cb) {
        let server = http.createServer(app);
        server.listen(port, cb);  // 3000, fn
    }

    return app;    
}

module.exports = express;


/*

	http.createServer(app);

	=> 內部實現偽代碼(示意用， 不是真正的實現)

		http.createServer = function(callBack){

			let request  = 解析http請求文本 ... {請求headers、請求路徑、請求方法}
			let response = 讓你可以響應內容到客戶端

			http.on('request', function(){  // 當 `每一次` 請求到來的時候調用

				callBack(request, response)
			
			}) ;
		}

*/