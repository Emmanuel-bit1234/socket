import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {LogService} from '@app/core/log.service';

@Directive({selector: '[appGrow]'})
export class GrowDirective implements OnInit {
  @HostBinding('style.flex-grow') private hostGrow = 1;
  @HostBinding('style.margin.px') private hostMargin;
  @HostBinding('style.margin-left.px') private hostMarginLeft;
  @HostBinding('style.margin-right.px') private hostMarginRight;

  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }

  @Input()
  set growMargin(value: number) {
    this.hostMargin = value;
  }

  @Input()
  set growLeft(value: number) {
    this.hostMarginLeft = value;
  }

  @Input()
  set growRight(value: number) {
    this.hostMarginRight = value;
  }

  ngOnInit(): void {
    const hostElse = (value: number) => this.hostMargin == null ? value : this.hostMargin;
    this.hostMarginLeft = this.hostMarginLeft == null ? hostElse(5) : this.hostMarginLeft;
    this.hostMarginRight = this.hostMarginRight == null ? hostElse(5) : this.hostMarginRight;
  }
}
