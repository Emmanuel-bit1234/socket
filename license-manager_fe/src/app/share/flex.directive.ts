import {Directive, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {LogService} from '@app/core/log.service';
import {Subscription} from 'rxjs';
import {CoreService} from '@app/core/core.service';

@Directive({selector: '[appFlex]'})
export class FlexDirective implements OnInit, OnDestroy {
  @HostBinding('style.display') private hostDisplay = 'flex';
  @Input() basis = 50;
  @HostBinding('style.flex-basis.%') private hostBasis;
  private subscription: Subscription;

  constructor(
    private log: LogService,
    private core: CoreService
  ) {
    log.construct(this.constructor.name);
  }

  ngOnInit(): void {
    this.subscription = this.core.$handsetObserver.subscribe(next => this.hostBasis = next ? 100 : this.basis);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
