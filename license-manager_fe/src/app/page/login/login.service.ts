import {Injectable} from '@angular/core';
import {Observable, throwError, of} from 'rxjs';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {LogService} from '@app/core/log.service';
import {CoreService} from '@app/core/core.service';
import {handle, scrub} from '@app/share/share.model';
import {map, tap} from 'rxjs/operators';
import {UserModel} from '@app/core/core.model';
import { PartyDetails, VerifyDomainUser, Client } from './login.model';
import { SnackService } from '@app/custom/snack/snack.service';
import { SpinService } from '@app/custom/spin/spin.service';
import { Router } from '@angular/router';
import { DialogService } from '@app/custom/dialog/dialog.service';
import { AppComponent } from '@app/app.component';
import { Login } from './login';


@Injectable()
export class LoginService {
  //client: Client = new Client;
  constructor(
    private log: LogService,
    private http: HttpClient,
    private core: CoreService,
    private snack: SnackService,
    private spin: SpinService,
    private router: Router,
    private dialog:DialogService,
    private app:AppComponent,
  ) {
    log.construct(this.constructor.name);
  }

  isSigningOfficer(domainUser: string): Observable<Boolean> {
    let params = new HttpParams();
    if (domainUser != null) {
      params = params.set('domainUser', domainUser);
    }
    params = params.set('_fields', 'membership,nonrepudiation').set('_exacts', 'domainUser');
    return this.http.get<PartyDetails[]>('/enrolment/api/parties', { params })
      .pipe(
        map(next => next.pop() || {}),
        map(next => next.membership === 'staff' && next.nonrepudiation === true),
        tap(next=>next === true?"":this.returnToLogin("Invalid Credentials")),
        handle({
          status: 500,
          contains: 'invalid_grant',
          message: 'grant failed'
        })
      )
  }

  idcsAuthentication(data: { username: string, password: string }): Observable<UserModel> {
    scrub(data);
    const body= "username="+data.username+"&password="+data.password+"&grant_type=password&scope=urn:opc:idm:__myscopes__"

    if (data.username == null) {
      return throwError('username invalid');
    }
    if (data.password == null) {
      return throwError('password invalid');
    }
    return this.http.post<UserModel['security']>('/oauth2/v1/token', body, { headers: { 'Authorization': 'Basic '+ this.core.secret_key, 'Content-Type': 'application/x-www-form-urlencoded' } })
      .pipe(
        map(
          next => ({
            name: data.username,
            admin: false,
            security: next
          })
        ),
        tap(next => this.core.user = next),
        handle({
          status: 500,
          contains: 'invalid_grant',
          message: 'grant failed'
        })
      );
  }

  returnToLogin(errorMsg:string){
    this.log.info(errorMsg);
    this.spin.on(
      of(this.core.$userSubject.next(null)),
    ).subscribe(
      () => {
        this.dialog.create().info('error', 'Access Not Authorised').afterClosed().subscribe(
          ()=>{
            this.core.user=null,
            this.app.logout()}
        );
      },
      err => {
        this.log.error(err);
        this.dialog.create().info('error', err).afterClosed().subscribe();
      }
    );
  }

  login(data: { username: string, password: string }): Observable<UserModel> {
    scrub(data);
    if (data.username == null) {
      return throwError('username invalid');
    }
    if (data.password == null) {
      return throwError('password invalid');
    }
    return this.http.post<UserModel['security']>('/shared/api/security', data)
      .pipe(
        map(
          next => ({
            name: data.username,
            admin: false,
            security: next
          })
        ),
        tap(next => this.core.user = next),
        handle({
          status: 500,
          contains: 'invalid_grant',
          message: 'grant failed'
        },
        {
          status: 401,
          contains: 'unauthorized',
          message: 'login failed'
        })
      );
  }

  verifyDomainUser(username: string, data:{signed:string}):Observable<VerifyDomainUser>{
    if (username == null) {
      return throwError('username invalid');
    }
    this.log.info(data);
    username = username.toLowerCase();
    return this.http.post<VerifyDomainUser>(`/enrolment/api/certificates/verify/domain/${username}`,data)
    .pipe(
      tap(next=> this.log.info(next)),
      handle({
        status: 500,
        contains: 'invalid_grant',
        message: 'grant failed'
      })
    );
  }  

  onSecurity(domainUser: string): Observable<UserModel> {
    const headerparameter = 'SystemDashboardId:FWcc5UeD';
    const encodedString = btoa(headerparameter);
    const data = 'Basic ' + encodedString;

    const body = 'grant_type=client_credentials&SCOPE=SystemDashboardResource.scope1';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': data,
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-OAUTH-IDENTITY-DOMAIN-NAME': 'DesktopAppIdentityDomain'
      })
    };
    return this.http.post<UserModel['security']>(`/oauth2/rest/token`, body, httpOptions).pipe(
      map(
        next => ({
          name: domainUser,
          admin: false,
          security: next
        })
      ),
      tap(next => this.core.user = next),
      tap(next=>this.log.info(next)),
      handle({
            status: 400,
            message: 'Failed',
            contains: 'login failed'
        })
    );
  }

  read(): Observable<UserModel> {
    return this.http.get<UserModel>(`/GetToken/samlToken`)
      .pipe();
  }

  onGrant(username: UserModel['name'], security: UserModel['security'] ): Observable<UserModel> {
    //this.log.info({ onGrant: UserModel });
    //const headers = new HttpHeaders().set('Authorization', `${model.security.token_type} ${model.security.access_token}`);
    const params = new HttpParams()
      .set('domainUser', username)
      .set('membership', 'staff')
      .set('status', 'active')
      .set('limit','1')
      .set('_fields', 'id,domainUser,region,district,branch,beneficiary,supervisor');
    return this.http.get<UserModel['grant']>('/enrolment/api/parties', {params})
      .pipe(
        map(next=> this.core.user.grant = next[0]),
        tap(next=>this.log.info(next))
      );
  }
}


// onGrant(model: { username: LoginModel['username'], security: UserModel['security'] }): Observable<UserModel> {
//   this.log.info({ onGrant: model });
//   //const headers = new HttpHeaders().set('Authorization', `${model.security.token_type} ${model.security.access_token}`);
//   const params = new HttpParams()
//     .set('domainUser', model.username)
//     .set('membership', 'staff')
//     .set('status', 'active')
//     .set('_fields', 'id,domainUser,region,district,branch,beneficiary,supervisor');
//   return this.http.get<UserModel['grant'][]>('/enrolment/api/parties', {params})
//     .pipe(
//       map(next => next.shift()),
//       errorIf(next => next == null, 'not found'),
//       errorIf(next => next.beneficiary === false, 'not allowed'),
//       map(grant => ({ security: model.security, grant }))
//     );
// }
