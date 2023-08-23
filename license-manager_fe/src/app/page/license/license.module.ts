import {NgModule} from '@angular/core';
import {LogService} from '@app/core/log.service';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {ShareModule} from '@app/share/share.module';
import {ButtonsModule} from '@app/custom/buttons/buttons.module';
import {LoginService} from '@app/page/login/login.service';
import {DialogModule} from '@app/custom/dialog/dialog.module';
import { FingerPrintDialogModule } from '@app/custom/fingerprint-dialog/fingerprint-dialog.module';
import { AppComponent } from '@app/app.component';
import { ScanService } from '../scan/scan.service';
import { LicenseRoutingModule } from './license-routing.module';
import { LicenseComponent } from './license.component';
import { LoadModule } from '@app/custom/load/load.module';
import { ReadModule } from '@app/custom/read/read.module';
import { LicenseService } from './license.service';


@NgModule({
  imports: [
    ShareModule,
    LicenseRoutingModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    ButtonsModule,
    DialogModule,
    FingerPrintDialogModule,
    MatCheckboxModule,
    MatSelectModule,
    LoadModule,
    ReadModule,
    FormsModule
  ],
  declarations: [LicenseComponent],
  providers: [LicenseService,ScanService]
})
export class LicenseModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}



