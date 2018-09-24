import { MurenoResponse } from "./MurenoResponse";
import { MurenoRequest } from './MurenoRequest';

interface RoutesDictionary {
  [index: string]: (req: MurenoRequest, res: MurenoResponse) => void;
}

export default class MurenoRoutes {
  get: RoutesDictionary = {}
  put: RoutesDictionary = {}
  patch: RoutesDictionary = {}
  post: RoutesDictionary = {}
  delete: RoutesDictionary = {}
  constructor() {
    
  }
}
