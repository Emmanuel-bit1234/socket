import {Component, Inject, InjectionToken} from '@angular/core';
import {LogService} from '@app/core/log.service';

export const SPIN_DATA = new InjectionToken<{ text: string }>('SpinData');

@Component({
  selector: 'app-spin',
  templateUrl: './spin.component.html',
  styleUrls: ['./spin.component.scss']
})
export class SpinComponent {
  constructor(private log: LogService, @Inject(SPIN_DATA) public data: { text: string }) {
    log.construct(this.constructor.name);
  }
}
