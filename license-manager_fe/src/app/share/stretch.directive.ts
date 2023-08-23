import {Directive, HostBinding} from '@angular/core';
import {LogService} from '@app/core/log.service';

@Directive({selector: '[appStretch]'})
export class StretchDirective {
  @HostBinding('style.flex-grow') hostFlexGrow = 1;

  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
