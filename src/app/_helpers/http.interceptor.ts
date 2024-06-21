import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (isPlatformBrowser(this.platformId)) {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        const cloned = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
        return next.handle(cloned);
      }
    }
    return next.handle(req);
  }
}
