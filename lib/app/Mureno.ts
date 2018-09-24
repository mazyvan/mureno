import { Server } from "http"
import { startServer } from "./start-server";
import ServerRouter from "./server-router";
import MurenoRoutes from './MurenoRoutes';
import { Middleware } from './Middleware';

interface Options {
  routes?: MurenoRoutes
}

export default class Mureno {
  port: number;
  hostname = '127.0.0.1'
  server: Server
  serverIsRunning: boolean = false
  serverStarted: boolean = false
  router: ServerRouter
  middlewareList: Middleware[] = []

  routes = new MurenoRoutes()

  constructor(port: number = 3000, options: Options = {}) {
    this.port = port
    if (typeof options === 'object') {
      if (options.routes) this.routes = options.routes
    }
  }

  middleware(cb: Middleware) {
    this.middlewareList.push(cb)
  }

  start() {
    if (this.serverIsRunning) {
      console.error("There's one app running, please stop that before starting a new one")
      return
    }
    if (this.serverStarted) {
      console.error("There's one app starting right now, please wait until the process finished")
      return
    }
    this.serverStarted = true
    this.router = new ServerRouter(this.middlewareList, this.routes)
    this.server = startServer(this.router.serverRouter)

    this.server.listen(this.port, this.hostname, () => {
      this.serverIsRunning = true
      this.serverStarted = false
      console.log(`Mureno app running at http://${this.hostname}:${this.port}/`)
    })
  }

  stop() {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        this.serverIsRunning = false
        console.log(`Server stopped`)
        resolve()
      })
    })
  }
}