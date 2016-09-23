
import {RequestMethod} from './../core/enums';

export function normalizeMethodName(method: string | RequestMethod): RequestMethod {

  if(typeof method === 'string') {
    let originalMethod = method;
    method = <string> method.toUpperCase();
    method = <RequestMethod>(<{[key: string]: any}>RequestMethod)[method];

    if(typeof method !== 'number') {
      throw new Error(`Invalid request method. "${originalMethod}" is not supported`);
    }

    return <RequestMethod> method;
  }
}
