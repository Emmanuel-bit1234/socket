import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';
import { Observable, EMPTY } from 'rxjs';
import { take, catchError } from 'rxjs/operators';
import { LogService } from '@app/core/log.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class LoginResolverService implements Resolve<any> {

  constructor( private log: LogService,private loginService: LoginService, private router: Router, private route: ActivatedRoute) {
    log.construct(this.constructor.name);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.loginService.read()
      .pipe(catchError(error => {
        //window.location.href = environment.baseUrl;
        //this.router.navigate(['login']).then(value => this.shareService.snack(error));
        return EMPTY;
      }));
  }
}
