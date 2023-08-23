import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LogService} from '@app/core/log.service';
import {Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html'
})
export class LinkComponent {
  @Input()
  path: string;
  @Input()
  routeName: string;
  @Output() close = new EventEmitter();

  constructor(
    private log: LogService,
    private router: Router,
    private breakpoint: BreakpointObserver
  ) {
    log.construct(this.constructor.name);
  }

  click() {
    this.router.navigate([this.path])
      .then(() => this.breakpoint.isMatched('(max-width: 640px)') && this.close.next());
  }

  active() {
    return this.router.isActive(this.path, true);
  }
}
