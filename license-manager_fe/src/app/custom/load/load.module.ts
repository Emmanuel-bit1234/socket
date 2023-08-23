import {NgModule} from '@angular/core';
import {LoadComponent} from './load.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {CommonModule} from '@angular/common';
import {LogService} from '@app/core/log.service';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  exports: [LoadComponent],
  declarations: [LoadComponent]
})
export class LoadModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
