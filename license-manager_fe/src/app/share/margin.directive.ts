import {Directive, HostBinding} from '@angular/core';
import {LogService} from '@app/core/log.service';

@Directive({selector: '[appMargin]'})
export class MarginDirective {
  @HostBinding('style.margin.px') hostMargin = 10;

  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
