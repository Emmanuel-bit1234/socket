import {NgModule} from '@angular/core';
import {LogService} from '@app/core/log.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {SpinModule} from '@app/custom/spin/spin.module';

@NgModule({
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    SpinModule
  ]
})

export class CoreModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
