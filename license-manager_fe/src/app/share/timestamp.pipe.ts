import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({name: 'timestamp'})
export class TimestampPipe implements PipeTransform {
  transform(date: Date | string, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
    return new DatePipe('en-US').transform(date, format);
  }
}
