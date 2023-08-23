import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {LogService} from '@app/core/log.service';
import {DialogData} from '@app/custom/dialog/dialog.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  templateUrl: './fingerprint-dialog.component.html',
  styleUrls: ['./fingerprint-dialog.component.scss']
})
export class FingerPrintDialogComponent {
  formGroup: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<FingerPrintDialogComponent, boolean | string>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private log:LogService
    ){
    log.construct(this.constructor.name);
  }

  closeDialog() {
   setTimeout(() => {
   this.dialogRef.close()
}, 3000);
  }

  onConfirm() {
    this.dialogRef.close(!!this.formGroup ? this.formGroup.get('input').value : true);
  }

  onReject() {
    this.dialogRef.close(!!this.formGroup ? this.formGroup.get('input').value : false);
  }

}
