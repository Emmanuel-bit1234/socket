import {NgModule} from '@angular/core';
import {LogService} from '@app/core/log.service';
import {ShareModule} from '@app/share/share.module';
import {ReadModule} from '@app/custom/read/read.module';
import {PartyService} from '@app/page/party/party.service';
import {ButtonsModule} from '@app/custom/buttons/buttons.module';
import {PartyRoutingModule} from '@app/page/party/party-routing.module';
import {PartyComponent} from '@app/page/party/party.component';
import {LoadModule} from '@app/custom/load/load.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import {DialogModule} from '@app/custom/dialog/dialog.module';

@NgModule({
  imports: [
    ShareModule,
    PartyRoutingModule,
    ButtonsModule,
    ReadModule,
    LoadModule,
    MatTooltipModule,
    DialogModule
  ],
  declarations: [PartyComponent],
  providers: [PartyService]
})
export class PartyModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
