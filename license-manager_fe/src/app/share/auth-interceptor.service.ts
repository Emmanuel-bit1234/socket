import {Injectable} from '@angular/core';
import {EMPTY, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {CoreService} from '@app/core/core.service';
import {LogService} from '@app/core/log.service';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refreshing = false;

  constructor(
    private core: CoreService,
    private router: Router,
    private http: HttpClient,
    private log: LogService
  ) {
    log.construct(this.constructor.name);
  }

  intercept(req: HttpRequest<any>, res: HttpHandler): Observable<HttpEvent<any>> {

    if(this.core.user && this.core.downloadFileFlag === true){
      req = req.clone({
        setHeaders: {
          Accept: 'application/octet-stream',
          Authorization: `${this.core.user.security.token_type} ${this.core.user.security.access_token}`,
          XRequestedBy: localStorage['base64']
        }
      });
      this.core.downloadFileFlag = false;
    }
    else if (this.core.user) {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json',
          Authorization: `${this.core.user.security.token_type} ${this.core.user.security.access_token}`,
          XRequestedBy: localStorage['base64']
        }
      });
    } 
    else {
      req = req.clone({
        setHeaders: {
          Accept: 'application/json'
        }
      });
    }
    return res.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !!this.core.user) {
          if (this.refreshing === true) {
            this.refreshing = false;
            this.core.user = null;
            this.router.navigate(['login']).then(() => this.log.error('refresh failed'));
            return EMPTY;
          }
          this.refreshing = true;
          return this.http.patch<{ access_token: string }>('/shared/api/security', {refresh_token: this.core.user.security.refresh_token})
            .pipe(
              tap(next => this.core.user.security.access_token = next.access_token),
              tap(() => this.core.user = this.core.user),
              switchMap(() => res.handle(req))
            );
        }
        return throwError(error);
      })
    );
  }
}
