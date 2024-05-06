import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable({providedIn: 'root'})
/**
 * Http Interceptor intercepting Http Requests, adding the client's IP to their X-Forwarded-For header
 */
export class ForwardClientIpInterceptor implements HttpInterceptor {
  constructor(@Inject(REQUEST) protected req: any) {
  }

  /**
   * Intercept http requests and add the client's IP to the X-Forwarded-For header
   * @param httpRequest
   * @param next
   */
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const clientIp = this.req.get('x-forwarded-for') || this.req.connection.remoteAddress;
//   return next.handle(httpRequest.clone({ setHeaders: { 'X-Forwarded-For': clientIp } }));

// This came from here: https://github.com/DSpace/dspace-angular/issues/2902
// UM Change.  I was having issues getting the referer, aske Tim about it and
// he pointed me to this.  This is not solve the issue, but seems like it would 
// be good to have anyway
    const headers = { 'X-Forwarded-For': clientIp };

    // if the request has a user-agent retain it
    const userAgent = this.req.get('user-agent');
    if (userAgent) {
      headers['User-Agent'] = userAgent;
    }

    return next.handle(httpRequest.clone({ setHeaders: headers }));
  }
}
