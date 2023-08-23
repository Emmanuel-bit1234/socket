import { Component, OnInit, Input, Directive } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { Observable, EMPTY, Subscription, BehaviorSubject, forkJoin, of, zip, throwError } from 'rxjs';
import { LocationModel, LicenseModel, LicenseFile, OldKeyOutput, PartyModel, notIssued, IssueModel } from './license.model';
import { LogService } from '@app/core/log.service';
import { CoreService } from '@app/core/core.service';
import { LicenseService } from './license.service';
import { tap, catchError, switchMap, delay } from 'rxjs/operators';
import { DialogService } from '@app/custom/dialog/dialog.service';
import { ScanService } from '../scan/scan.service';
import { AppComponent } from '@app/app.component';
import { SnackService } from '@app/custom/snack/snack.service';
import { SpinService } from '@app/custom/spin/spin.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MessageIn, MessageOut } from '../scan/scan.model';
import { stringify } from 'querystring';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})

export class LicenseComponent implements OnInit {
  form: FormGroup;
  $regions: Observable<LocationModel[]>;
  $districts: Observable<LocationModel[]>;
  $branches: Observable<LocationModel[]>;
  private subject$: WebSocketSubject<MessageIn | MessageOut>;
  //disabled: boolean = true;
  //noSerialKey: boolean = true;
  //noSeqKey: boolean = true;
  showLink: boolean = false;
  showVerifyButton: boolean =false;
  noLicenseFlag: boolean = false;
  domainUserExists:boolean = null;
  domainUserMatch:boolean = null;
  socket$: Subscription;
  result: { label: string, value: any, image?: string };
  oldkeyValidity:OldKeyOutput = {} as OldKeyOutput;
  availableLicense:notIssued = {} as notIssued;
  fileDetails:notIssued = {} as notIssued;
  issueDetails:IssueModel = {} as IssueModel;
  incorrectLicenseFileArray:String[] = [] as String[];
  correctLicenseFile:String;



  constructor(
    private log: LogService,
    public core: CoreService,
    private license: LicenseService,
    private builder: FormBuilder,
    private dialog: DialogService,
    private scan: ScanService,
    private app: AppComponent,
    private snack: SnackService,
    private spin:SpinService
  ) {
    log.construct(this.constructor.name);
    this.form = builder.group({
      region: builder.control(null, Validators.required),
      district: builder.control(null, Validators.required),
      branch: builder.control(null, Validators.required),
      domainUser: builder.control(null, Validators.required),
      LicenseKey: builder.control({value: null, disabled: false}),
      DistributorID: builder.control({value: null, disabled: false}),
      SequenceNumber: builder.control({value: null, disabled: false}),
      License: builder.control({value: false, disabled: false}),
      DisSeqCheckBox : builder.control({value: false, disabled: false}),
      serialKeyCheckBox : builder.control({value: false, disabled: false})
    })

    this.$regions = this.license.onSearchRegions()
      .pipe(
        tap(next => {
          if (next.length > 0) {
            this.log.info("Region:",next)
          }
        }),
        catchError(err => {
          this.log.error(err);
          return EMPTY;
        })
      );


  }

  ngOnInit() {
     //this.showLink = true;
     //this.showVerifyButton = true;
  }

  private updateIssueAndFile(){
    this.license.updateFile(this.availableLicense.id).subscribe(
      next=>{
        this.log.info(next)
        this.fileDetails = next;
        this.license.updateIssue(this.issueDetails.id,this.fileDetails).subscribe(
          next=>{
            this.log.info(next),
            this.form.reset();
            this.showLink = false;
            this.showVerifyButton = false;
          },
          err=>{
            this.log.info(next),
            this.snack.open(err.error.messages[0])
          }
        )
      },
      err=>{
        this.log.info(err),
        this.snack.open(err.error.messages[0])
      }
    )
  }

  districtChange(event){
    //this.log.info(event)
    this.form.get('branch').setValue(null);
    this.$branches = this.license.onSearchBranches(event.id)
    .pipe(
      tap(next => {
        if (next.length > 0) {
          this.log.info("Branches:",next)
        }
      }),
      catchError(err => {
        this.log.error(err);
        return EMPTY;
      })
    );
  }

  regionChange(event){
    //this.log.info(event)
    this.form.get('district').setValue(null);
    this.$districts = this.license.onSearchDistricts(event.id)
    .pipe(
      tap(next => {
        if (next.length > 0) {
          this.log.info("District:",next)
        }
      }),
      catchError(err => {
        this.log.error(err);
        return EMPTY;
      })
    );
  }


  onDownload() {

    this.license.downloadLink(this.availableLicense.id)
    .subscribe(
      next=>{
        const blob = new Blob([next],{type:'text/plain'});
        if(window.navigator && window.navigator.msSaveOrOpenBlob){
          window.navigator.msSaveBlob(blob,this.availableLicense.name)
          this.showVerifyButton = true;
        }
        else{
          const link = document.createElement('a');
          link.href = URL.createObjectURL(next);
          link.download = this.availableLicense.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.showVerifyButton = true;
        }
      },
      err=>{
        this.log.info(err)
      }
    )

  }

  onSubmit() {
    this.log.info("DomainUser:",(this.form.get("domainUser").value).toLowerCase() + "LoggedInUser:",this.core.loggedInUser.toLowerCase())
    if((this.form.get("domainUser").value).toLowerCase() === this.core.loggedInUser.toLowerCase()){
      this.snack.open("Domain user can't match the logged in user!Please enter a domain user that isn't you");
      this.form.get('domainUser').setValue(null);
      this.domainUserMatch = true;
      return;
    }else{
      this.domainUserMatch = false;
    }

    this.license.validateDomainUser(this.form.get('domainUser').value)
    .pipe(
      tap(next => {
        if (next.length>0) {
          //this.log.info("Party:",next) 
          this.domainUserExists = true;
          if(this.domainUserExists === true && this.domainUserMatch === false){
            this.oldKeyValidity();
          }
        }
        else{
          this.snack.open("Domain user doesn't exist");
          this.form.get('domainUser').setValue(null);
          this.domainUserExists = false;
          return;
        }
      }),
      catchError(err => {
        this.log.error(err);
        return EMPTY;
      })
    ).subscribe()
  
  }


  private oldKeyValidity(){
    if (this.form.get('LicenseKey').value !== null){
      //this.log.info(this.form.get('LicenseKey').value);
      this.license.oldKeys(this.form.get('LicenseKey').value)
      .subscribe(
        next=>{
          this.log.info(next),
          this.oldkeyValidity = next;
          if(next.deactivated === false){
            this.license.updateActivationStatus(next.id).subscribe(
              next=>{
                this.log.info(next),
                this.issue();
              },
              err=>{
                this.log.info(err)
                this.snack.open(err.error.messages[0])
              }
            )
          }else{
            this.snack.open("License Key has been previously been deactivated");
          }
        },
        err=>{
          this.log.info(err),
          this.snack.open('old serial key not found')
        }
      )
    }else if((this.form.get('DistributorID').value !== null && this.form.get('SequenceNumber').value !== null) || this.form.get('License').value === true){
      this.oldkeyValidity.oldserialkey = null;
      //this.log.info(this.oldkeyValidity.oldserialkey)
      this.issue();
    }else{
      this.snack.open('Select an option in order to renew license')
    }
  }


  private issue(){

    if(this.oldkeyValidity.oldserialkey !== null ||
      (this.form.get('DistributorID').value !== null && this.form.get('SequenceNumber').value !== null) ||
      this.form.get('License').value !== null){

        this.log.info(this.form.get('branch').value.value,this.form.get('domainUser').value,this.form.get('License').value,
        this.oldkeyValidity.oldserialkey, this.form.get('DistributorID').value,this.form.get('SequenceNumber').value)

        this.license.createIssue(this.form.get('branch').value.value,this.form.get('domainUser').value,this.form.get('License').value,
        this.oldkeyValidity.oldserialkey, this.form.get('DistributorID').value,this.form.get('SequenceNumber').value)
        .subscribe(
          next=>{
            this.log.info(next)
            this.issueDetails = next;
            this.license.availableLicense().subscribe(
              next=>{
                this.log.info("Available License: ",next)
                this.availableLicense = next;
                this.showLink = true;
              },
              err=>{
                this.log.info(err),
                this.snack.open(err.error.messages[0])
              }
            )
          },
          err=>{
            this.log.info(err),
            this.snack.open(err.error.messages[0])
          }
        )
      }
  }

  isChecked(event) {
    //this.log.info(event.checked)
    if (event.checked === true) {
      this.dialog.create().confirm('Warning', 'are you sure there is no license?You will be wasting a license if you are not sure!').afterClosed().subscribe(
        next => {
          this.log.info(next)
          if (next === true) {
            this.noLicenseFlag = true;
            this.form.get('License').setValue(true);
            this.form.get('LicenseKey').setValue(null);
            this.form.get('SequenceNumber').setValue(null);
            this.form.get('DistributorID').setValue(null);
            this.form.controls.DistributorID.disable()
            this.form.controls.SequenceNumber.disable()
            this.form.controls.LicenseKey.disable();
            this.form.get('DisSeqCheckBox').setValue(true);
            this.form.get('serialKeyCheckBox').setValue(true);
            return;

          } else {
            this.noLicenseFlag = false;
            this.form.get('License').setValue(false);
            // this.noSerialKey = true;
            // this.disabled = false;
          }
        },
        err => {
          this.log.info(err);
        }
      );
    } else {
            this.noLicenseFlag = false;
            this.form.get('DisSeqCheckBox').setValue(false);
            this.form.get('serialKeyCheckBox').setValue(false);
            this.form.controls.DistributorID.enable()
            this.form.controls.SequenceNumber.enable()
            this.form.controls.LicenseKey.enable();
      // this.noSerialKey = true;
      // this.noSeqKey = true;
      // this.log.info(this.noSeqKey, this.noSerialKey)
    }
  }

  licenseKeyChange(event){
    //this.log.info(this.form.get('LicenseKey').value.length);
    if(this.form.get('LicenseKey').value.length > 0){
      this.form.get('SequenceNumber').setValue(null);
      this.form.get('DistributorID').setValue(null);
      this.form.get('DisSeqCheckBox').setValue(true);
      this.form.controls.DistributorID.disable()
      this.form.controls.SequenceNumber.disable()
      this.noLicenseFlag = false;
      this.form.get('License').setValue(false);
    }else{
      this.form.get('serialKeyCheckBox').setValue(true);
      this.form.controls.LicenseKey.disable();
    }
  }

  DisOrSeqChange(event){
    this.log.info('DistID',this.form.get('DistributorID').value,'Seq',this.form.get('SequenceNumber').value);
    if(this.form.get('SequenceNumber').value !== null || this.form.get('DistributorID').value !== null){
      this.form.get('LicenseKey').setValue(null);
      this.form.get('serialKeyCheckBox').setValue(true);
      this.form.controls.LicenseKey.disable()
      this.noLicenseFlag = false;
      this.form.get('License').setValue(false);
    }else{
      this.form.get('DisSeqCheckBox').setValue(true);
      this.form.controls.DistributorID.disable()
      this.form.controls.SequenceNumber.disable()

    }
  }

  serialLicenseKeyChange(event) {
    this.log.info(event)
    if (event.checked === true) {
      this.form.get('LicenseKey').setValue(null);
      // this.noSerialKey = false;
      // this.noSeqKey = true;
      // this.log.info(this.noSeqKey, this.noSerialKey)
      this.form.controls.LicenseKey.disable();
    }else{
      if(this.noLicenseFlag === true){
        this.form.get('serialKeyCheckBox').setValue(true);
        this.snack.open('The no license checkbox is ticked!')
      }else{
        this.form.controls.LicenseKey.enable();
      }
      
    }
  }

  branchChange(event){
    this.log.info(this.form.get('branch').value.value,this.form.get('domainUser').value,this.form.get('License').value,
   this.form.get('region').value,this.form.get('district').value)
  }

  seqKeyChange(event) {
    if (event.checked === true) {
      this.form.get('SequenceNumber').setValue(null);
      this.form.get('DistributorID').setValue(null);
      // this.noSeqKey = false;
      // this.disabled = true;
      this.form.controls.DistributorID.disable()
      this.form.controls.SequenceNumber.disable()
    }else{
      if(this.noLicenseFlag === true){
        this.form.get('DisSeqCheckBox').setValue(true);
        this.snack.open('The no license checkbox is ticked!')
      }else{
        this.form.controls.DistributorID.enable()
        this.form.controls.SequenceNumber.enable()
      }
      
    }
  }

  onVerify(){
    this.subject$ = new WebSocketSubject<MessageIn | MessageOut>(`wss://127.0.0.1:49080/protow/api/socket`);
    this.socket$ = this.socket().subscribe(message => {
      if (message.error) {
        this.log.error(message.error);
        if(message.error.code === -32605){
          this.snack.open('Old version of web socket server is being used')
          this.license.verifyLicense('No readLicense() on wss').subscribe(
            next=>{
              this.log.info(next)
            },
            err=>{this.log.info(err)}
          )
          return;
        }
      }
      switch (message.method) {
        case 'readLicense': {
          const result = message.result as [{ name: LicenseModel['name'], contents: LicenseModel['contents'] }];
          this.result = { label: 'output', value: result };
          this.log.info("Result: ",this.result)
          this.incorrectLicenseFileArray=[];
          if (result.length > 0) {
            let j = 0;
            for (let i = 0; i < result.length; i++) {
              //call api here mutiple times
              //this.log.info("Index at beginning: ",j)
              if(result[i].name === this.availableLicense.name){
                this.correctLicenseFile = result[i].name;
                //this.log.info("CorrectLicenseFile: ",this.correctLicenseFile);
              }
              else{
                this.incorrectLicenseFileArray[j] = result[i].name;
                //this.log.info("IncorrectLicenseFile: ",this.incorrectLicenseFileArray)
                j++;
                //this.log.info("Index at end: ",j)
              }

              this.license.verifyLicense(result[i].name).subscribe(
                next=>{
                  this.log.info(next)
                },
                err=>{this.log.info(err)}
              )
            }
          } else {
            //this.snack.open("No License found!!")
            this.dialog.create().info('Error','No license found in the web socket server directory').afterClosed().subscribe();
          }
          //this.log.info(this.incorrectLicenseFileArray)
          //this.log.info("length:",this.incorrectLicenseFileArray.length)
          
          if(this.incorrectLicenseFileArray.length > 0){
            let index = 0;
            while(index < this.incorrectLicenseFileArray.length){
              this.dialog.create().info('Error', 'Incorrect License: ' + this.incorrectLicenseFileArray[index] +'\n' +
              'The license file must be in the web socket server folder and must be named: ' + this.availableLicense.name + '\n' +
              'This should be the only license file in the folder').afterOpened().subscribe();
              index++;
            }
          }else if(this.incorrectLicenseFileArray.length === 0 && result.length > 0){
            this.dialog.create().info('Info', 'License verified: ' + this.correctLicenseFile).afterClosed().subscribe();
            this.updateIssueAndFile();
          }
          break;
        }
      }
    }, error => {
        this.dialog.create().info('error', error).afterClosed().subscribe(
          //()=>this.app.logout()
        );
    })
    
    this.send({ method: 'readLicense', id: 1 });
  }

  private send(message: MessageIn): void {
    if (this.socket$.closed) {
      this.dialog.create().info('error', 'socket server is closed').afterClosed().subscribe(
        //()=>this.app.logout()
      );
      return;
    }
    delete this.result;
    this.next(message);
  }

  socket(): Observable<MessageOut> {
    return this.subject$.pipe(
      tap(next => this.log.info('channel', next)),
      catchError(err => {
        this.log.error(err);
        this.dialog.create().info('info','Insert license into web socker server folder and start the web socket server').afterClosed().subscribe();
        return EMPTY;
      })
    ) as Observable<MessageOut>
  }

  next(message: MessageIn) {
    this.log.info('next', message);
    this.subject$.next(message);
  }

}
