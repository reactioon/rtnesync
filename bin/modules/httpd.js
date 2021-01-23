sys.modules.httpd = {

    load: function() {

        sys.load.actions();

        const http = require('http');
        const port = sys._httpdPort;

        var httpsCore = function (req, res) {

            method = req.method;
            res.setHeader('Content-Type', 'application/json;charset=utf-8');

            switch(method) {
                case "GET":
                    sys.modules.httpd.methods.GET(req, res);
                break;
                case "POST":
                    sys.modules.httpd.methods.POST(req, res);
                break;
                default:
                    sys.throwError(res);
                break;
            }

        }

        const server = http.createServer(httpsCore);

        server.listen(port, function (){
            console.log("Server listening on port " + port);
        });

        return server;

    }

};

/*
 * Methods
 */

sys.modules.httpd.methodsAllowedGET = [
    '_init', '_about', '_address', '_stats'
];

sys.modules.httpd.methodsAllowedPOST = [];

sys.modules.httpd.methods = {

    GET : function(req, res){

        hashUrl = req.url.replace("/","");
        methodsAllowedGET = sys.modules.httpd.methodsAllowedGET;

        if (methodsAllowedGET.includes(hashUrl)) {
            actionReturn = sys.returnJSON(sys.actions[hashUrl]());
            res.end(actionReturn);
        } else {
            sys.throwError(res, "method '" + req.url + "' don't found to GET requests.");
        }

    },
    POST : function(req, res) {

        sys.throwError(res, "method '" + req.url + "' don't found to POST requests.");

    }

}
