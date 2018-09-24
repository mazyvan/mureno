import { createServer } from "http"
import { MurenoRequest } from './MurenoRequest';
import { MurenoResponse } from './MurenoResponse';

export function startServer(cb: (req: MurenoRequest, res: MurenoResponse) => void) {
  return createServer(cb)
}