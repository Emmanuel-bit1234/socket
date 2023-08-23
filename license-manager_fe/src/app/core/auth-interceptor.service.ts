import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {CoreService} from '@app/core/core.service';
import {LogService} from '@app/core/log.service';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private core: CoreService,
    private log: LogService
  ) {
    log.construct(this.constructor.name);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        Accept: `Application/json`
      }
    });
    return this.core.$user.pipe(
      take(1),
      map(user => !!user ? {headers: req.headers.set('Authorization', `${user.security.token_type} ${user.security.access_token}`)} : null),
      switchMap(update => next.handle(!!update ? req.clone(update) : req))
    );
  }

}
