import {Component, OnDestroy} from '@angular/core';
import {CoreService} from '@app/core/core.service';
import {LogService} from '@app/core/log.service';
import {Subscription} from 'rxjs';
import {SnackService} from '@app/custom/snack/snack.service';
import {ScanService} from '@app/page/scan/scan.service';
import {MessageIn, WSQ} from '@app/page/scan/scan.model';

@Component({
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnDestroy {
  socket$: Subscription;
  result: { label: string, value: any, image?: string };

  constructor(
    private log: LogService,
    private core: CoreService,
    private snack: SnackService,
    private scan: ScanService
  ) {
    log.construct(this.constructor.name);
    this.socket$ = this.scan.socket().subscribe(message => {
      if (message.error) {
        this.log.error(message.error);
        return this.snack.open(message.error.message);
      }
      switch (message.method) {
        case 'getVersion': {
          const result = message.result as { version: number };
          this.result = {label: 'version', value: result.version};
          break;
        }
        case 'scanFinger': {
          const result = message.result as { nfiq: number };
          this.result = {label: 'nfiq', value: result.nfiq};
          break;
        }
        case 'getPublicKey': {
          const result = message.result as { modulus: string, exponent: string };
          this.result = {label: 'modulus | exponent', value: `${result.modulus} | ${result.exponent}`};
          break;
        }
        case 'lockFingers': {
          this.snack.open('locked');
          break;
        }
        case 'signMessage': {
          const result = message.result as { signature: string };
          this.result = {label: 'signature', value: result.signature};
          break;
        }
        case 'enrolFinger': {
          this.snack.open('enrolled');
          break;
        }
        case 'matchFinger': {
          this.snack.open('matched');
          break;
        }
        case 'getTemplate': {
          const result = message.result as { template: string };
          this.result = {label: 'template', value: result.template};
          break;
        }
        case 'getImage': {
          const result = message.result as { image: string, type: 'png' | 'wsq' };
          this.result = {label: 'type', value: result.type, image: result.image};
          break;
        }
        case 'convertImage': {
          const result = message.result as { image: string, type: 'png' | 'wsq' };
          this.result = {label: 'type', value: result.type, image: result.image};
          break;
        }
      }
    }, error => this.snack.open(error));
  }

  ngOnDestroy(): void {
    this.socket$.unsubscribe();
  }

  private send(message: MessageIn): void {
    if (this.socket$.closed) {
      this.snack.open('Closed');
      return;
    }
    delete this.result;
    this.scan.next(message);
  }

  onVersion() {
    this.send({method: 'getVersion', id: 0});
  }

  onScanFinger() {
    this.send({method: 'scanFinger', id: 0, params: {timeout: 3000}});
  }

  onPublicKey() {
    this.send({method: 'getPublicKey', id: 0});
  }

  onLockFingers() {
    this.send({method: 'lockFingers', id: 0});
  }

  onSignMessage() {
    this.send({method: 'signMessage', params: {content: 'content'}, id: 0});
  }

  onEnrolFinger() {
    this.send({method: 'enrolFinger', params: {slot: 'primary'}, id: 0});
  }

  onMatchFinger() {
    this.send({method: 'matchFinger', params: {slot: 'primary'}, id: 0});
  }

  onTemplate() {
    this.send({method: 'getTemplate', id: 0});
  }

  onImage() {
    this.send({method: 'getImage', params: {type: 'png'}, id: 0});
  }

  onConvertImage() {
    this.send({method: 'convertImage', params: {image: WSQ, to: 'png'}, id: 0});
  }
}
