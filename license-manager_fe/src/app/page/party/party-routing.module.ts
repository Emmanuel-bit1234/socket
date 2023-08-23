import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogService} from '@app/core/log.service';
import {PartyComponent} from '@app/page/party/party.component';

const routes: Routes = [{path: '', component: PartyComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
