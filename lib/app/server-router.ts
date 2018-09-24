import { ServerRequest, ServerResponse } from "http"
import * as url from "url";
import MurenoRoutes from './MurenoRoutes';
import { MurenoRequest } from './MurenoRequest';
import { MurenoResponse } from './MurenoResponse';
import * as querystring from 'querystring';
import { StringDecoder } from 'string_decoder';
import { Middleware } from './Middleware';

export default class ServerRouter {
  middlewareList: Middleware[] = []
  routes: MurenoRoutes


  constructor(middlewareList: Middleware[], routes: MurenoRoutes) {
    this.middlewareList = middlewareList
    this.routes = routes
  }

  serverRouter = (req: MurenoRequest, res: MurenoResponse, next?: (error?) => any) => {
    res.setHeader('X-Powered-By', 'MurenoFramework')
    req.res = res;
    res.req = req;
    req.next = next;

    const urlParsed = url.parse(req.url)
    const pathname = urlParsed.pathname

    const method = req.method.toLowerCase()
    if (!this.routes[method]) {
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain')
      res.end('Sorry the Mureno framework only supports the GET, POST, PUT, PATCH, and DELETE methods\n')
      return
    }

    const route = this.routes[method][pathname]
    if (!route) {
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain')
      res.end('Route not found\n')
      return
    }

    /**
     * Extending the res build in functionality
     */
    res.json = function (...args) {
      this.setHeader('Content-Type', 'application/json')

      if (args.length == 0) {
        this.statusCode = 200
        this.end()
        return
      }

      if (args.length == 1) {
        this.statusCode = 200
        this.end((args[0] != null) ? JSON.stringify(args[0]) : undefined)
        return
      }

      this.statusCode = args[0]
      this.end((args[1] != null) ? JSON.stringify(args[1]) : undefined)
    }

    /**
     * Extending the req build in functionality
     */
    req.query = querystring.parse(urlParsed.query)

    const decoder = new StringDecoder('utf-8')
    let payload = ''

    req.on('data', (data) => {
      payload += decoder.write(data)
    })

    req.on('end', () => {
      payload += decoder.end()
      req.body = null
      if (payload) {
        try {
          req.body = JSON.parse(payload)
        } catch (error) { }
      }

      // TO BE CHECKED
      for (let index = 0; index < this.middlewareList.length; index++) {
        const currentMiddleWare = this.middlewareList[index];
        currentMiddleWare(req, res, next)
        if (!this.middlewareList[index + 1]) route(req, res)
      }
      return
    })
  }
}
