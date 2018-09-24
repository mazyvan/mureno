import { ServerRequest, ServerResponse } from "http";
import { MurenoRequest } from './MurenoRequest';
import { MurenoResponse } from './MurenoResponse';

export type Middleware = (req: MurenoRequest | ServerRequest, res: MurenoResponse | ServerResponse, next: (error?: any) => any) => any;
