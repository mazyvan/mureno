"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var querystring = require("querystring");
var string_decoder_1 = require("string_decoder");
var ServerRouter = /** @class */ (function () {
    function ServerRouter(middlewareList, routes) {
        var _this = this;
        this.middlewareList = [];
        this.serverRouter = function (req, res, next) {
            res.setHeader('X-Powered-By', 'MurenoFramework');
            req.res = res;
            res.req = req;
            req.next = next;
            var urlParsed = url.parse(req.url);
            var pathname = urlParsed.pathname;
            var method = req.method.toLowerCase();
            if (!_this.routes[method]) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Sorry the Mureno framework only supports the GET, POST, PUT, PATCH, and DELETE methods\n');
                return;
            }
            var route = _this.routes[method][pathname];
            if (!route) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Route not found\n');
                return;
            }
            /**
             * Extending the res build in functionality
             */
            res.json = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                this.setHeader('Content-Type', 'application/json');
                if (args.length == 0) {
                    this.statusCode = 200;
                    this.end();
                    return;
                }
                if (args.length == 1) {
                    this.statusCode = 200;
                    this.end((args[0] != null) ? JSON.stringify(args[0]) : undefined);
                    return;
                }
                this.statusCode = args[0];
                this.end((args[1] != null) ? JSON.stringify(args[1]) : undefined);
            };
            /**
             * Extending the req build in functionality
             */
            req.query = querystring.parse(urlParsed.query);
            var decoder = new string_decoder_1.StringDecoder('utf-8');
            var payload = '';
            req.on('data', function (data) {
                payload += decoder.write(data);
            });
            req.on('end', function () {
                payload += decoder.end();
                req.body = null;
                if (payload) {
                    try {
                        req.body = JSON.parse(payload);
                    }
                    catch (error) { }
                }
                // TO BE CHECKED
                for (var index = 0; index < _this.middlewareList.length; index++) {
                    var currentMiddleWare = _this.middlewareList[index];
                    currentMiddleWare(req, res, next);
                    if (!_this.middlewareList[index + 1])
                        route(req, res);
                }
                return;
            });
        };
        this.middlewareList = middlewareList;
        this.routes = routes;
    }
    return ServerRouter;
}());
exports.default = ServerRouter;
//# sourceMappingURL=server-router.js.map