import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {LogService} from '@app/core/log.service';

@Directive({selector: '[appWrap]'})
export class WrapDirective implements OnInit {
  @HostBinding('style.display') private hostDisplay = 'flex';
  @HostBinding('style.flex-wrap') private hostWrap = 'wrap';
  @HostBinding('style.margin.px') hostMargin;
  @HostBinding('style.margin-left.px') private hostMarginLeft;
  @HostBinding('style.margin-right.px') private hostMarginRight;
  @HostBinding('style.margin-top.px') private hostMarginTop;
  @HostBinding('style.margin-bottom.px') hostMarginBottom;

  @Input()
  set wrapMargin(value: number) {
    this.hostMargin = value;
  }

  @Input()
  set wrapLeft(value: number) {
    this.hostMarginLeft = value;
  }

  @Input()
  set wrapRight(value: number) {
    this.hostMarginRight = value;
  }

  @Input()
  set wrapTop(value: number) {
    this.hostMarginTop = value;
  }

  @Input()
  set wrapBottom(value: number) {
    this.hostMarginBottom = value;
  }

  constructor(
    private log: LogService
  ) {
    log.construct(this.constructor.name);
  }

  ngOnInit(): void {
    const hostElse = (value: number) => this.hostMargin == null ? value : this.hostMargin;
    this.hostMarginLeft = this.hostMarginLeft == null ? hostElse(5) : this.hostMarginLeft;
    this.hostMarginRight = this.hostMarginRight == null ? hostElse(5) : this.hostMarginRight;
    this.hostMarginTop = this.hostMarginTop == null ? hostElse(10) : this.hostMarginTop;
    this.hostMarginBottom = this.hostMarginBottom == null ? hostElse(0) : this.hostMarginBottom;
  }
}
