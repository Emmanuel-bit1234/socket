import {NgModule} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {OverlayModule} from '@angular/cdk/overlay';
import {LogService} from '@app/core/log.service';
import {SpinService} from './spin.service';
import {SpinComponent} from './spin.component';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
    MatProgressSpinnerModule
  ],
  exports: [SpinComponent],
  declarations: [SpinComponent],
  entryComponents: [SpinComponent],
  providers: [SpinService]
})
export class SpinModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
