import {Component} from '@angular/core';
import {CoreService} from '@app/core/core.service';
import {LogService} from '@app/core/log.service';
import {SnackService} from '@app/custom/snack/snack.service';
import {PartyService} from '@app/page/party/party.service';
import {SpinService} from '@app/custom/spin/spin.service';
import {DialogService} from '@app/custom/dialog/dialog.service';
import {filter, switchMap} from 'rxjs/operators';
import {PartyModel} from '@app/page/party/party.model';

@Component({
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent {
  data: PartyModel;

  constructor(
    private log: LogService,
    public core: CoreService,
    private spin: SpinService,
    private snack: SnackService,
    private party: PartyService,
    private dialog: DialogService
  ) {
    log.construct(this.constructor.name);
  }

  onCreate() {
    const data: PartyModel = {idNumber: '8008180277084', fullname: 'fn', surname: 'sn', fingerprinted: false};
    this.spin.on(
      this.party.onCreate(data)
    ).subscribe(
      next => {
        this.data = next;
        this.snack.open('created');
      },
      err => {
        this.log.error(err);
        this.snack.open(err);
      }
    );
  }

  onRead(id: PartyModel['id']) {
    this.spin.on(
      this.party.onRead(id)
    ).subscribe(
      next => {
        this.data = next;
        this.snack.open('read');
      },
      err => {
        this.log.error(err);
        this.snack.open(err);
      }
    );
  }

  onUpdate(data: PartyModel) {
    const clone: PartyModel = {...data, fingerprinted: true};
    this.spin.on(
      this.party.onUpdate(clone)
    ).subscribe(
      next => {
        this.data = next;
        this.snack.open('updated');
      },
      err => {
        this.log.error(err);
        this.snack.open(err);
      }
    );
  }

  onDelete(id: PartyModel['id']) {
    this.dialog.create().confirm('delete', 'are you sure?').afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.spin.on(this.party.onDelete(id)))
      )
      .subscribe(
        () => {
          this.data = null;
          this.snack.open('deleted');
        },
        err => {
          this.log.error(err);
          this.snack.open(err);
        }
      );
  }

  onSearch() {
    const data: PartyModel = {idNumber: '8008180277084'};
    this.spin.on(
      this.party.onSearch(data)
    ).subscribe(
      next => {
        this.data = next.pop();
        this.snack.open(`searched`);
      },
      err => {
        this.log.error(err);
        this.snack.open(err);
      }
    );
  }

  onReset() {
    this.data = null;
    this.snack.open(`reset`);
  }
}
