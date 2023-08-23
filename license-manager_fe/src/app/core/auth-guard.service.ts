import {Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {map, switchMap, take, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {LogService} from '@app/core/log.service';
import {CoreService} from '@app/core/core.service';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanLoad {
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
        map(next => next != null),
        tap(next => this.log.info(`canLoad '${route.path}' ${next}`)),
        switchMap(
          next => next ? Promise.resolve(true) : this.router.navigate(['login']).then(() => false)
        )
      );
  }
}
