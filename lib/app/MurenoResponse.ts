import { ServerResponse } from "http";
import { MurenoRequest } from './MurenoRequest';

export interface MurenoResponse extends ServerResponse {
  json: (...args) => void;
  req: MurenoRequest,
}