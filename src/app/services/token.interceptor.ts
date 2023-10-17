import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const tokenizedReq = req.clone({
      setHeaders: {
        'x-rapidapi-key': 'b330a9297772ce7b5e2f8e1effbe1a92',
        //'x-rapidapi-host': 'v3.football.api-sports.io',
      },
    });
    return next.handle(tokenizedReq);
  }
}
