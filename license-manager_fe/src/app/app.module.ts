import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {CoreModule} from '@app/core/core.module';
import {LinkComponent} from '@app/custom/link/link.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from '@app/app-routing.module';
import {LogService} from '@app/core/log.service';
import { ShareModule } from './share/share.module';
import { DialogModule } from './custom/dialog/dialog.module';
import { FingerPrintDialogModule } from './custom/fingerprint-dialog/fingerprint-dialog.module';
import { ConfigService } from './services/config';
import { LicenseComponent } from './page/license/license.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    ShareModule,
    DialogModule,
    FingerPrintDialogModule
  ],
  declarations: [AppComponent, LinkComponent],
  bootstrap: [AppComponent],
  providers: [ConfigService]
})
export class AppModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
