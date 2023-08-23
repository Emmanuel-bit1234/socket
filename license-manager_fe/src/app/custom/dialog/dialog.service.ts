import {Injectable} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {DialogComponent} from './dialog.component';
import {DialogData} from './dialog.model';
import {LogService} from '@app/core/log.service';

@Injectable()
export class DialogService {

  constructor(
    private log: LogService,
    private matDialog: MatDialog
  ) {
    log.construct(this.constructor.name);
  }

  create() {
    const base = (data: DialogData) => {
      const config = new MatDialogConfig<DialogData>();
      config.data = data;
      config.disableClose = true;
      config.panelClass = 'app-dialog';
      return this.matDialog.open(DialogComponent, config);
    };
    return {
      info: (title: string, content: string): MatDialogRef<DialogComponent, boolean> => base({
        title, content, confirm: {confirm: 'ok'}
      }),
      confirm: (title: string, content: string): MatDialogRef<DialogComponent, boolean> => base({
        title, content, confirm: {confirm: 'yes', reject: 'no'}
      }),
      custom: (data: DialogData): MatDialogRef<DialogComponent, boolean> => base(data)
    };
  }

}
