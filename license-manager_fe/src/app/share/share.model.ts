import { NativeDateAdapter } from '@angular/material/core';
import {Observable, of, OperatorFunction, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import { Injectable } from "@angular/core";

@Injectable()
export class AppDateAdapter extends NativeDateAdapter {
  format(date: Date, displayFormat: {}): string {
    return displayFormat ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : date.toDateString();
  }
}

export const errorIf = <T>(condition: (next) => boolean, message?: string): OperatorFunction<T, T> =>
  (source$: Observable<T>): Observable<T> => source$
    .pipe(
      tap(next => {
        if (condition(next)) {
          throw {error: message};
        }
      })
    );
export const throwIf = <T>(condition: (value) => boolean): OperatorFunction<T, T> =>
  (source$: Observable<T>): Observable<T> => source$
    .pipe(
      tap(next => condition(next) && throwError(undefined))
    );
export const catchThen = <T>(then: T): OperatorFunction<T, T> => (source$: Observable<T>): Observable<T> =>
  source$
    .pipe(
      catchError(() => of(then))
    );

export function scrub(value: object) {
  Object.keys(value).forEach(key => {
    if (value.hasOwnProperty(key) && typeof value[key] === 'string') {
      value[key] = value[key].trim();
      if (value[key] === '') {
        delete value[key];
      }
    }
  });
  return value;
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
