import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router} from '@angular/router';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {LogService} from '@app/core/log.service';
import {CoreService} from '@app/core/core.service';

@Injectable({providedIn: 'root'})
export class AdminGuardService implements CanLoad, CanActivate {
  constructor(
    private log: LogService,
    private router: Router,
    private core: CoreService
  ) {
    log.construct(this.constructor.name);
  }

  canLoad(route: Route): Observable<boolean> {
    return this.core.$user
      .pipe(
        take(1),
        map(next => next && next.admin),
        tap(next => this.log.info(`canLoad '${route.path}' ${next}`)),
        switchMap(
          next => next ? Promise.resolve(true) : this.router.navigate(['info']).then(() => false)
        )
      );
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.core.$user
      .pipe(
        take(1),
        map(next => !route.queryParamMap.has('user') || route.queryParamMap.has('user') && next.admin),
        tap(next => this.log.info(`canActivate '${route.url}' ${next}`)),
        switchMap(
          next => next ? Promise.resolve(true) : this.router.navigate(['info']).then(() => false)
        )
      );
  }
}
