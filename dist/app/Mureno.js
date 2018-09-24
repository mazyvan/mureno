"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var start_server_1 = require("./start-server");
var server_router_1 = require("./server-router");
var MurenoRoutes_1 = require("./MurenoRoutes");
var Mureno = /** @class */ (function () {
    function Mureno(port, options) {
        if (port === void 0) { port = 3000; }
        if (options === void 0) { options = {}; }
        this.hostname = '127.0.0.1';
        this.serverIsRunning = false;
        this.serverStarted = false;
        this.middlewareList = [];
        this.routes = new MurenoRoutes_1.default();
        this.port = port;
        if (typeof options === 'object') {
            if (options.routes)
                this.routes = options.routes;
        }
    }
    Mureno.prototype.middleware = function (cb) {
        this.middlewareList.push(cb);
    };
    Mureno.prototype.start = function () {
        var _this = this;
        if (this.serverIsRunning) {
            console.error("There's one app running, please stop that before starting a new one");
            return;
        }
        if (this.serverStarted) {
            console.error("There's one app starting right now, please wait until the process finished");
            return;
        }
        this.serverStarted = true;
        this.router = new server_router_1.default(this.middlewareList, this.routes);
        this.server = start_server_1.startServer(this.router.serverRouter);
        this.server.listen(this.port, this.hostname, function () {
            _this.serverIsRunning = true;
            _this.serverStarted = false;
            console.log("Mureno app running at http://" + _this.hostname + ":" + _this.port + "/");
        });
    };
    Mureno.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.server.close(function () {
                _this.serverIsRunning = false;
                console.log("Server stopped");
                resolve();
            });
        });
    };
    return Mureno;
}());
exports.default = Mureno;
//# sourceMappingURL=Mureno.js.map