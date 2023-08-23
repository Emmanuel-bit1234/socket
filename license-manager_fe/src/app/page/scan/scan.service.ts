import {Injectable, OnDestroy} from '@angular/core';
import {MessageIn, MessageOut} from './scan.model';
import {WebSocketSubject} from 'rxjs/webSocket';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {LogService} from '@app/core/log.service';

@Injectable()
export class ScanService implements OnDestroy {
  private subject$: WebSocketSubject<MessageIn | MessageOut>;

  constructor(
    private log: LogService
  ) {
    log.construct(this.constructor.name);
    this.subject$ = new WebSocketSubject<MessageIn | MessageOut>(`wss://127.0.0.1:49080/protow/api/socket`);
  }

  ngOnDestroy(): void {
    this.subject$.unsubscribe();
  }

  socket(): Observable<MessageOut> {
    return this.subject$.pipe(
      tap(next => this.log.info('channel', next)),
      catchError(err => {
        this.log.error(err);
        return this.log.error('failed');
      })
    ) as Observable<MessageOut>;
  }

  next(message: MessageIn) {
    this.log.info('next', message);
    this.subject$.next(message);
  }
}
