import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {LogService} from '@app/core/log.service';
import {handle, scrub} from '@app/share/share.model';
import {PartyModel} from '@app/page/party/party.model';

@Injectable()
export class PartyService {
  constructor(
    private log: LogService,
    private http: HttpClient
  ) {
    log.construct(this.constructor.name);
  }

  onCreate(data: PartyModel): Observable<PartyModel> {
    scrub(data);
    if (data.fullname == null) {
      return throwError('fullname invalid');
    }
    if (data.surname == null) {
      return throwError('surname invalid');
    }
    if (data.idNumber == null) {
      return throwError('idNumber invalid');
    }
    if (data.fingerprinted == null) {
      return throwError('fingerprinted invalid');
    }
    return this.http.post<PartyModel>('/beneficiary/api/parties', data)
      .pipe(
        handle({
          status: 400,
          contains: 'party exists',
          message: 'exists'
        })
      );
  }

  onRead(id: PartyModel['id']): Observable<PartyModel> {
    if (id == null) {
      return throwError('id invalid');
    }
    return this.http.get<PartyModel>(`/beneficiary/api/parties/${id}`)
      .pipe(
        handle({
          status: 404,
          contains: 'party not found',
          message: 'not found'
        })
      );
  }

  onUpdate(data: PartyModel): Observable<PartyModel> {
    scrub(data);
    if (data.id == null) {
      return throwError('id invalid');
    }
    return this.http.patch<PartyModel>(`/beneficiary/api/parties/${data.id}`, data)
      .pipe(
        handle({
          status: 404,
          contains: 'party not found',
          message: 'not found'
        })
      );
  }

  onDelete(id: PartyModel['id']): Observable<void> {
    if (id == null) {
      return throwError('id invalid');
    }
    return this.http.delete<void>(`/beneficiary/api/parties/${id}`)
      .pipe(
        handle()
      );
  }

  onSearch(data: PartyModel): Observable<PartyModel[]> {
    scrub(data);
    let params = new HttpParams();
    if (data.fullname != null) {
      params = params.set('fullname', data.fullname);
    }
    if (data.surname != null) {
      params = params.set('surname', data.surname);
    }
    if (data.idNumber != null) {
      params = params.set('idNumber', data.idNumber);
    }
    if (data.fingerprinted != null) {
      params = params.set('fingerprinted', `${data.fingerprinted}`);
    }
    params = params
      .set('_fields', 'id,idNumber,fullname,surname,fingerprinted,updated')
      .set('_exacts', 'idNumber')
      .set('_sort', '-created');
    return this.http.get<PartyModel[]>(`/beneficiary/api/parties`, {params})
      .pipe(
        handle()
      );
  }
}
