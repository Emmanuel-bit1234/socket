import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {LogService} from '@app/core/log.service';
import { LoginResolverService } from './login-resolver.service';
//for dev , comment loginresolverservice
const routes: Routes = [{path: '', component: LoginComponent,resolve: { login: LoginResolverService }}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
