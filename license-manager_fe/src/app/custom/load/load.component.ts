import {Component, HostBinding, Input} from '@angular/core';
import {LogService} from '@app/core/log.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent {
  @HostBinding('style.min-height.px') minHeight = 60;
  diameter = 48;

  @Input()
  set height(value: number) {
    this.minHeight = value || 60;
    this.diameter = Math.round(this.minHeight * .8);
  }

  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }

}
