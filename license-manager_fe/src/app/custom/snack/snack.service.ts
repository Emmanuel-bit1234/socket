import {Injectable} from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import {LogService} from '@app/core/log.service';

@Injectable()
export class SnackService {
  constructor(
    private log: LogService,
    private matSnackBar: MatSnackBar
  ) {
    log.construct(this.constructor.name);
  }

  open(message: string | Error): MatSnackBarRef<SimpleSnackBar> {
    const config: MatSnackBarConfig = new MatSnackBarConfig();
    config.duration = 3000;
    return this.matSnackBar.open(message instanceof Error ? message.message : message, 'OK', config);
  }
}
