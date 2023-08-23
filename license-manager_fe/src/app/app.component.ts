import { Component, HostBinding, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { LogService } from '@app/core/log.service';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { CoreService } from '@app/core/core.service';
import { SpinService } from '@app/custom/spin/spin.service';
import { OverlayContainer, OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { SnackService } from '@app/custom/snack/snack.service';
import { environment } from '@env/environment';
import { build } from '@env/build';
import { FingerPrintDialogService } from './custom/fingerprint-dialog/fingerprint-dialog.service';
import { DialogService } from './custom/dialog/dialog.service';
import { ConfigService } from './services/config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') theme;
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  handset: boolean;
  socket$: Subscription;
  production = environment.prod;
  version = build.version;
  config:any;

  constructor(
    private log: LogService,
    public router: Router,
    public core: CoreService,
    private spin: SpinService,
    private snack: SnackService,
    public overlay: OverlayContainer,
    private activated: ActivatedRoute,
    private fPrintDialogService: FingerPrintDialogService,
    private dialog: DialogService,
    private configService:ConfigService
  ) {
    log.construct(this.constructor.name);
    this.config = configService.loadJSON('assets/config.json')
    core.secret_key = this.config['secret_key'];
    this.toggleTheme();
    let ref: OverlayRef;
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        return ref = this.spin.ref();
      }
      return ref && ref.dispose();
    });
    this.core.$handsetObserver.subscribe(handset => this.handset = handset);

    // this.socket$ = this.core.socket().subscribe(message => {
    //   if (message.event === 'OnCardDisconnect') {
    //     this.fPrintDialogService.closeAllDialog();
    //     this.log.info("Card has been disconnected");
    //     this.logout();
    //   }
    //   if (message.error) {
    //     this.log.error(message.error);
    //     return this.dialog.create().info('error', message.error.message).afterClosed().subscribe();
    //   }
    // }, error => this.dialog.create().info('error', error).afterClosed().subscribe());
  }

  toggleTheme() {
    this.overlay.getContainerElement().classList.remove(this.theme);
    this.theme = this.theme === 'theme-light' ? 'theme-dark' : 'theme-light';
    this.overlay.getContainerElement().classList.add(this.theme);
  }

  logout() {
    //this.sideNav.close()
    this.core.user = null;
    window.location.href = environment.baseUrl;
  }
}
