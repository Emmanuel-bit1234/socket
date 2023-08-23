import {NgModule} from '@angular/core';
import {ScanRoutingModule} from './scan-routing.module';
import {ScanComponent} from './scan.component';
import {LogService} from '@app/core/log.service';
import {ShareModule} from '@app/share/share.module';
import {ReadModule} from '@app/custom/read/read.module';
import {ScanService} from '@app/page/scan/scan.service';
import {LoadModule} from '@app/custom/load/load.module';

@NgModule({
  imports: [
    ShareModule,
    ScanRoutingModule,
    ReadModule,
    LoadModule
  ],
  declarations: [ScanComponent],
  providers: [ScanService]
})
export class ScanModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
