import { Observable, OperatorFunction, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackService } from '@app/custom/snack/snack.service';

export interface AppUser {
  name: string;
  admin: boolean;
  security: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  };
}

export function handle<T>(...errors: { status: number, message: string, contains?: string }[]): OperatorFunction<T, T> {
  return (source$: Observable<T>): Observable<T> => source$.pipe(
    catchError((httpError: HttpErrorResponse) => {
      for (const error of errors) {
        if (httpError.status === error.status) {
          if (error.contains == null) {
            return throwError(error.message);
          }
          if (httpError.error.messages instanceof Array && httpError.error.messages.includes(error.contains)) {
            return throwError(error.message);
          }
        }
      }
      return throwError('failed');
    })
  );
}

export function errorIf<T>(condition: (data) => boolean, message: string): OperatorFunction<T, T> {
  return (source$: Observable<T>): Observable<T> => source$.pipe(
    tap(next => {
      if (condition(next)) {
        throw new Error(message);
      }
    })
  );
}

