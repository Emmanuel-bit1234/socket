import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {LogService} from '@app/core/log.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @HostBinding('style.margin.px') hostMargin;
  @HostBinding('style.margin-left.px') hostMarginLeft;
  @HostBinding('style.margin-right.px') hostMarginRight;
  @HostBinding('style.margin-top.px') hostMarginTop;
  @HostBinding('style.margin-bottom.px') hostMarginBottom;

  @Input()
  set margin(value: number) {
    this.hostMargin = value || 10;
  }

  @Input()
  set left(value: number) {
    this.hostMarginLeft = value || 10;
  }

  @Input()
  set right(value: number) {
    this.hostMarginRight = value || 10;
  }

  @Input()
  set top(value: number) {
    this.hostMarginTop = value || 10;
  }

  @Input()
  set bottom(value: number) {
    this.hostMarginBottom = value || 10;
  }

  constructor(
    private log: LogService
  ) {
    log.construct(this.constructor.name);
  }

  ngOnInit(): void {
    this.hostMarginLeft = this.hostMarginLeft == null ? this.hostMargin : this.hostMarginLeft;
    this.hostMarginRight = this.hostMarginRight == null ? this.hostMargin : this.hostMarginRight;
    this.hostMarginTop = this.hostMarginTop == null ? this.hostMargin : this.hostMarginTop;
    this.hostMarginBottom = this.hostMarginBottom == null ? this.hostMargin : this.hostMarginBottom;
  }
}
