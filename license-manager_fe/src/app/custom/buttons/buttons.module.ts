import {NgModule} from '@angular/core';
import {ButtonsComponent} from '@app/custom/buttons/buttons.component';
import {CommonModule} from '@angular/common';
import {LogService} from '@app/core/log.service';

@NgModule({
  imports: [CommonModule],
  exports: [ButtonsComponent],
  declarations: [ButtonsComponent]
})
export class ButtonsModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
