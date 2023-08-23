import {NgModule} from '@angular/core';
import {ReadComponent} from '@app/custom/read/read.component';
import {CommonModule} from '@angular/common';
import {LogService} from '@app/core/log.service';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule
  ],
  exports: [ReadComponent],
  declarations: [ReadComponent]
})
export class ReadModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
