import {NgModule} from '@angular/core';
import {DialogComponent} from './dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {LogService} from '@app/core/log.service';
import {DialogService} from './dialog.service';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  entryComponents: [DialogComponent],
  declarations: [DialogComponent],
  providers: [DialogService]
})
export class DialogModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
