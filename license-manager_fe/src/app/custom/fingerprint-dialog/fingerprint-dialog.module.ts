import {NgModule} from '@angular/core';
import {FingerPrintDialogComponent} from './fingerprint-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {LogService} from '@app/core/log.service';
import {FingerPrintDialogService} from './fingerprint-dialog.service';
import {ReactiveFormsModule} from '@angular/forms';
import {ShareModule} from '@app/share/share.module';



@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  entryComponents: [FingerPrintDialogComponent],
  declarations: [FingerPrintDialogComponent],
  providers: [FingerPrintDialogService,FingerPrintDialogComponent]
})
export class FingerPrintDialogModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
