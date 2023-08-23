import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginGuardService} from '@app/core/login-guard.service';
import {AuthGuardService} from '@app/core/auth-guard.service';
import {LogService} from '@app/core/log.service';

const routes: Routes = [

  {path: 'party', loadChildren: () => import('@app/page/party/party.module').then(m => m.PartyModule), canLoad: [AuthGuardService]},
  {path: 'scan', loadChildren: () => import('@app/page/scan/scan.module').then(m => m.ScanModule), canLoad: [AuthGuardService]},
  {path: 'test', loadChildren: () => import('@app/page/test/test.module').then(m => m.TestModule), canLoad: [AuthGuardService]},
  {path: 'login', loadChildren: () => import('@app/page/login/login.module').then(m => m.LoginModule), canLoad: [LoginGuardService]},
  {path: 'license', loadChildren:() => import('@app/page/license/license.module').then(m => m.LicenseModule), canLoad: [AuthGuardService]},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
