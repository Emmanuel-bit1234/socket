import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {LogService} from '@app/core/log.service';
import {scrub, handle} from '@app/share/share.model';
import {UserModel} from '@app/core/core.model';
import {map} from 'rxjs/operators';
import { LocationModel, LicensePostModel, LicenseFile, OldKeyOutput, IssueModel, notIssued } from './license.model';
import { CoreService } from '@app/core/core.service';

@Injectable()
export class LicenseService {
  constructor(
    private log: LogService,
    private http: HttpClient,
    private core: CoreService
  ) {
    log.construct(this.constructor.name);
  }

  onSearchRegions(): Observable<LocationModel[]> {
    this.log.info('onSearchRegions');
    const params = new HttpParams()
      .set('type', 'region')
      .set('_fields', 'id,value')
      .set('_sort', 'value')
      .set('_nulls', 'parent')
      .set('_limit', '100');
    return this.http.get<LocationModel[]>('/beneficiary/api/locations', {params});
  }

  onSearchDistricts(region: number): Observable<LocationModel[]> {
    this.log.info({onSearchDistricts: region});
    const params = new HttpParams()
      .set('parent', `${region}`)
      .set('type', 'district')
      .set('_fields', 'id,value')
      .set('_sort', 'value')
      .set('_limit', '100');
    return this.http.get<LocationModel[]>('/beneficiary/api/locations', {params});
  }

  onSearchBranches(district: number): Observable<LocationModel[]> {
    this.log.info({onSearchBranches: district});
    const params = new HttpParams()
      .set('parent', `${district}`)
      .set('type', 'branch')
      .set('_fields', 'id,value')
      .set('_sort', 'value')
      .set('_limit', '100');
    return this.http.get<LocationModel[]>('/beneficiary/api/locations', {params});
  }

  validateDomainUser(domainUser:string):Observable<any>{
    const params = new HttpParams()
    .set('domainUser',`${domainUser}`)
    .set('_limit', '1');
    return this.http.get<any>('/enrolment/api/parties',{params})
  }

  verifyLicense(license:String): Observable<LicensePostModel> {
    if (license == null) {
      return throwError('license name invalid');
    }
    const data = {
      licensefile:license
    };
    return this.http.post<LicensePostModel>('/license/api/verify', data)
  }

  oldKeys(key:string):Observable<OldKeyOutput>{
    if(key === null){
      return throwError('Serial key invalid')
    }
    return this.http.get<OldKeyOutput>(`/license/api/oldkeys/byoldkey/${key}`)
    .pipe(
      handle({
        status: 404,
        contains: 'oldkeys not found',
        message: 'oldkeys not found'
      })
    );
  }

  updateActivationStatus(id:number):Observable<OldKeyOutput>{
    if(id === null){
      return throwError('ID invalid');
    }
    const data = {
      deactivated:true
    };
    return this.http.patch<OldKeyOutput>(`/license/api/oldkeys/${id}`,data)
  }

  createIssue(branch:string,domainUser:string,noIdLicense:boolean,oldserialkey?:string,distributor?:string,sequence?:string): Observable<IssueModel> {
    if (branch === null) {
      return throwError('branch name invalid');
    }
    if (domainUser === null) {
      return throwError('domain user name invalid');
    }
    if(noIdLicense === null){
      return throwError('no IdLicense invalid')
    }
    const data = {
      branch:branch,
      domainuser:domainUser,
      nooldlicense:noIdLicense,
      oldserialkey:oldserialkey,
      distributor:distributor,
      sequence:sequence
    };
    return this.http.post<IssueModel>('/license/api/issue', data)
  }

  downloadLink(id:number):Observable<any>{
    this.core.downloadFileFlag = true;
    //this.log.info("Flag:",this.core.downloadFileFlag)
    return this.http.get(`/license/api/file/file/${id}`,{responseType:'blob'});
  }

  updateIssue(issueID:number,license:notIssued):Observable<IssueModel>{
    if(issueID === null){
      return throwError('ID invalid');
    }
    const data = {
      licensefile:license.name,
      serialkey:license.key
    };
    return this.http.patch<IssueModel>(`/license/api/issue/${issueID}`,data)
  }

  updateFile(id:number):Observable<notIssued>{
    if(id === null){
      return throwError('ID invalid');
    }
    const data = {
      issued:true
    };
    return this.http.patch<notIssued>(`/license/api/file/${id}`,data)

  }

  availableLicense():Observable<notIssued>{
    return this.http.get<notIssued>(`/license/api/file/notissued`)
  }



}
