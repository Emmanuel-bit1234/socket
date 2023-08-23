import {NgModule} from '@angular/core';
import {TestRoutingModule} from './test-routing.module';
import {TestComponent} from './test.component';
import {LogService} from '@app/core/log.service';
import {ShareModule} from '@app/share/share.module';
import {LoadModule} from '@app/custom/load/load.module';
import {DialogModule} from '@app/custom/dialog/dialog.module';
import {ReadModule} from '@app/custom/read/read.module';

@NgModule({
  imports: [
    ShareModule,
    TestRoutingModule,
    LoadModule,
    DialogModule,
    ReadModule
  ],
  declarations: [TestComponent]
})
export class TestModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
