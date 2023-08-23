import {NgModule} from '@angular/core';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {LogService} from '@app/core/log.service';
import {FlexDirective} from '@app/share/flex.directive';
import {GrowDirective} from '@app/share/grow.directive';
import {WrapDirective} from '@app/share/wrap.directive';
import {MarginDirective} from '@app/share/margin.directive';
import {TimestampPipe} from '@app/share/timestamp.pipe';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '@app/share/auth-interceptor.service';
import {AppDateAdapter} from '@app/share/share.model';
import {CommonModule} from '@angular/common';
import {CoreModule} from '@app/core/core.module';
import {SnackModule} from '@app/custom/snack/snack.module';
import {StretchDirective} from '@app/share/stretch.directive';

@NgModule({
  imports: [
    MatNativeDateModule
  ],
  exports: [
    CoreModule,
    CommonModule,
    HttpClientModule,
    SnackModule,
    StretchDirective,
    WrapDirective,
    GrowDirective,
    FlexDirective,
    MarginDirective,
    TimestampPipe
  ],
  declarations: [
    StretchDirective,
    WrapDirective,
    GrowDirective,
    FlexDirective,
    MarginDirective,
    TimestampPipe
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: DateAdapter, useClass: AppDateAdapter}
  ]
})
export class ShareModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
