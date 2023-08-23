import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {LogService} from '@app/core/log.service';
import {CoreService} from '@app/core/core.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit, OnDestroy {
  @Input() label: string;
  @Input() value: any;
  @Input() basis = 50;

  multi: boolean;
  @HostBinding('style.flex-basis.%') private hostBasis;
  private subscription: Subscription;

  constructor(
    private log: LogService,
    private core: CoreService
  ) {
    log.construct(this.constructor.name);
  }

  @Input()
  set area(value: '' | 'true' | 'false') {
   this.multi = value === '' ? true : value === 'true';
    if(value)
    this.multi = true;
  }

  ngOnInit(): void {
    this.subscription = this.core.$handsetObserver.subscribe(next => this.hostBasis = next ? 100 : this.basis);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
