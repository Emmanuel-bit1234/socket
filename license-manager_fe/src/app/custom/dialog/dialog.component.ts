import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {LogService} from '@app/core/log.service';
import {DialogData} from '@app/custom/dialog/dialog.model';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {
  constructor(
    private log: LogService,
    public ref: MatDialogRef<DialogComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    log.construct(this.constructor.name);
  }
}
