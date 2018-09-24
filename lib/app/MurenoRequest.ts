import { ServerRequest } from "http";
import { ParsedUrlQuery } from 'querystring';
import { MurenoResponse } from './MurenoResponse';

export interface MurenoRequest extends ServerRequest {
  query: ParsedUrlQuery,
  body: JSON,
  res: MurenoResponse,
  next: (error?) => any
}