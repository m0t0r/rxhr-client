
import {RequestMethod, ResponseContentType, ContentType} from './../enums';
import {Headers} from './../headers/headers';
import {Body} from './../body/body';
import {normalizeMethodName} from './../../utils/utils';

export class Request extends Body {

  public method: RequestMethod;
  public responseType: ResponseContentType;
  public url: string;
  public headers: Headers;
  public withCredentials: boolean;

  private contentType: ContentType;

  constructor(requestOptions) {
    super();

    if(!requestOptions.url) {
      throw new Error('Request: Request object must have a url');
    }

    this.url = requestOptions.url;
    this.body = requestOptions.body;
    this.method = normalizeMethodName(requestOptions.method);
    this.headers = new Headers(requestOptions.headers);
    this.withCredentials = requestOptions.withCredentials;
    this.responseType = requestOptions.responseType;
    this.contentType = this.getContentType();


    //TODO: Support search params
  }

  // getContentType(): ContentType {
  //
  // }

}
