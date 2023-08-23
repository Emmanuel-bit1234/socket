import { Component } from '@angular/core';
import { LogService } from '@app/core/log.service';
import { SpinService } from '@app/custom/spin/spin.service';
import { SnackService } from '@app/custom/snack/snack.service';
import { CoreService } from '@app/core/core.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '@app/page/login/login.service';
import { DialogService } from '@app/custom/dialog/dialog.service';
import { AppComponent } from '@app/app.component';
import { FingerPrintDialogService } from '@app/custom/fingerprint-dialog/fingerprint-dialog.service';
import { ScanService } from '../scan/scan.service';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  form: FormGroup;
  //socket$: Subscription;
  domainUser: string;
  // input: VerifyDomainUserInput = {} as VerifyDomainUserInput;
  // result: { label: string, value: any, image?: string };
  // $scanStream : BehaviorSubject<any>
  // $matchStream : BehaviorSubject<any>
  // $signStream : BehaviorSubject<any>


  constructor(
    private log: LogService,
    public core: CoreService,
    private scan: ScanService,
    private spin: SpinService,
    private snack: SnackService,
    private router: Router,
    private builder: FormBuilder,
    private login: LoginService,
    private dialog: DialogService,
    private app: AppComponent,
    private fPrintDialogService: FingerPrintDialogService,
    private route: ActivatedRoute
  ) {
    log.construct(this.constructor.name);
    //for devoplement
     //this.core.loggedInUser = "virek-maharaj";
     this.onSubmit();
    //for production use
    this.route.data.subscribe((data: { login: any }) => {
      if (data.login !== null) {
        this.core.loggedInUser = data.login.userLogin
      }
    });

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.onSubmit();
  }

  onSubmit() {
    //this.log.info(this.core.loggedInUser)
    this.spin.on(this.login.onSecurity(this.core.loggedInUser))
      .subscribe(
        next => {
          localStorage['base64'] = btoa(this.core.loggedInUser)
          this.router.navigate(['license'])
        },
        err => {
          this.log.error(err);
          this.snack.open(err);

        }
      );
  }

}
