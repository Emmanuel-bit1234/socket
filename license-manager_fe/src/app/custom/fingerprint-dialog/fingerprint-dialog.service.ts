import {Injectable} from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {FingerPrintDialogComponent} from './fingerprint-dialog.component';
import {DialogData} from './fingerprint-dialog.model';
import {LogService} from '@app/core/log.service';

@Injectable()
export class FingerPrintDialogService {

  constructor(private log: LogService, 
    private matDialog: MatDialog,
    //private dialogRef: MatDialogRef<FingerPrintDialogService, boolean | string>,
    ) 
    {
    log.construct(this.constructor.name);
  }

  create() {
    const base = (data: DialogData) => {
      const config = new MatDialogConfig<DialogData>();
      config.data = data;
      //config.disableClose = true;
      config.panelClass = 'app-dialog';
      return this.matDialog.open(FingerPrintDialogComponent, config);
    };
    return {
      info: (title: string, content: string): MatDialogRef<FingerPrintDialogComponent, boolean> => base({
        title,
        content,
        confirm: {confirm: 'ok'}
      }),
      confirm: (title: string, content: string): MatDialogRef<FingerPrintDialogComponent, boolean> => base({
        title,
        content,
        confirm: {confirm: 'yes', reject: 'no'}
      }),
      input: (title: string, label: string, confirm?: string, reject?: string): MatDialogRef<FingerPrintDialogComponent, string> => base({
        title,
        label,
        confirm: {confirm: confirm || 'next', reject: reject || 'cancel'}
      }),
      custom: (data: DialogData): MatDialogRef<FingerPrintDialogComponent, boolean> => base(data)
    };
  }

   closeAllDialog() {
     this.matDialog.closeAll();
   }

}
