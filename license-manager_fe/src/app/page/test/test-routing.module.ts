import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TestComponent} from '@app/page/test/test.component';
import {LogService} from '@app/core/log.service';

const routes: Routes = [{path: '', component: TestComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule {
  constructor(private log: LogService) {
    log.construct(this.constructor.name);
  }
}
