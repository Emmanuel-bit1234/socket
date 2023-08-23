import {Component} from '@angular/core';
import {CoreService} from '@app/core/core.service';
import {LogService} from '@app/core/log.service';
import {SpinService} from '@app/custom/spin/spin.service';
import {SnackService} from '@app/custom/snack/snack.service';
import {DialogService} from '@app/custom/dialog/dialog.service';
import {of} from 'rxjs';
import {delay, tap} from 'rxjs/operators';

@Component({
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  loading: boolean;
  now = new Date();

  constructor(
    private log: LogService,
    private core: CoreService,
    private spin: SpinService,
    private snack: SnackService,
    private dialog: DialogService
  ) {
    log.construct(this.constructor.name);
  }

  onSpin() {
    this.spin.on(of('blah').pipe(delay(1000)), 'spinning').subscribe(() => this.log.info('done'));
  }

  onSnack() {
    this.snack.open('snacked');
  }

  onLoad() {
    of(this.loading = true).pipe(delay(1000), tap(() => this.loading = false)).subscribe(() => this.log.info('done'));
  }

  onInfo() {
    this.dialog.create().info('info', 'content').afterClosed().subscribe(() => this.log.info('done'));
  }

  onConfirm() {
    this.dialog.create().confirm('confirm', 'content').afterClosed().subscribe(result => this.log.info(`done ${result}`));
  }
}
