import {NgModule} from '@angular/core';
import {LoginRoutingModule} from './login-routing.module';
import {LoginComponent} from './login.component';
import {LogService} from '@app/core/log.service';
import {ReactiveFormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import {ShareModule} from '@app/share/share.module';
import {ButtonsModule} from '@app/custom/buttons/buttons.module';
import {LoginService} from '@app/page/login/login.service';
import {DialogModule} from '@app/custom/dialog/dialog.module';
import { FingerPrintDialogModule } from '@app/custom/fingerprint-dialog/fingerprint-dialog.module';
import { AppComponent } from '@app/app.component';
import { ScanService } from '../scan/scan.service';
import { LoginResolverService } from './login-resolver.service';


@NgModule({
  imports: [
    ShareModule,
    LoginRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonsModule,
    DialogModule,
    FingerPrintDialogModule
  ],
  declarations: [LoginComponent],
  providers: [LoginService,AppComponent,ScanService,LoginResolverService]
})
export class LoginModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}



