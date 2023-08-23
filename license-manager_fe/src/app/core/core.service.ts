import {Injectable} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {map, shareReplay, tap, catchError} from 'rxjs/operators';
import {LogService} from '@app/core/log.service';
import {environment} from '@env/environment';
import {UserModel} from '@app/core/core.model';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { DialogService } from '@app/custom/dialog/dialog.service';
import {LicenseModel } from '@app/page/license/license.model';
import { MessageIn, MessageOut } from '@app/page/scan/scan.model';

@Injectable({providedIn: 'root'})
export class CoreService {
  loggedInUser: string = null;
  //private subject$: WebSocketSubject<MessageIn | MessageOut>;
  secret_key:string;
  downloadFileFlag:boolean = false;
  //made userSubject public
  $userSubject = new BehaviorSubject<UserModel | null>(null);
  $user = this.$userSubject.asObservable();
  $handsetObserver = this.breakpointObserver.observe('(max-width: 640px)')
    .pipe(
      map(next => next.matches),
      shareReplay(1)
    );

  constructor(
    private log: LogService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog:DialogService
  ) {
    log.construct(this.constructor.name);
    //this.subject$ = new WebSocketSubject<MessageIn | MessageOut>(`wss://127.0.0.1:49080/protow/api/socket`);

    
    // if (!environment.prod) {
    //   this.user = {
    //     name: 'test',
    //     admin: false,
    //     security: {
    //       // tslint:disable-next-line:max-line-length
    //       access_token: 'test',
    //       token_type: 'Bearer',
    //       expires_in: 600,
    //       // tslint:disable-next-line:max-line-length
    //       refresh_token: 'test'
    //     }
    //   };
    // }
  }

  set user(user: UserModel | null) {
    this.$userSubject.next(user);
  }

  get user() {
    return this.$userSubject.value;
  }

  // socket(): Observable<MessageOut> {
  //   return this.subject$.pipe(
  //     tap(next => this.log.info('channel', next)),
  //     catchError(err => {
  //       this.log.error(err);
  //       this.user = null;
  //       window.location.href = environment.baseUrl;
  
  //       return throwError('Socket server closed');
  //     })
  //   ) as Observable<MessageOut>;
  // }

  // next(message: MessageIn) {
  //   this.log.info('next', message);
  //   this.subject$.next(message);
  // }
}
