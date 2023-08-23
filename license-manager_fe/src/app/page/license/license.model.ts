export interface LocationModel {
    id?: number;
    value?: string;
  }

  export interface PartyModel{
    id?:number;
    domainUser?:string;
  }

  export interface LicenseModel{
    name:string;
    contents:string;
  }

  export interface LicensePostModel{
    id:number;
    licensefile:string;
    created:string;
    creator:string;
  }

  export interface LicenseFile{
    licensefile:string;
  }

  export interface OldKeyOutput{
    id:number;
    oldserialkey?:string;
    deactivated:boolean;
    created:string;
    creator:string;
    updated:string;
    updator:string;
  }

  export interface notIssued{
    id:number;
    name:string;
    key:string;
    issued:boolean;
    reserved:boolean;
  }

  export interface IssueModel{
    id:number;
    branch:string;
    domainUser:string;
    oldserialkey:string;
    distributor:number;
    sequence:number;
    noIdlicense:boolean;
    licensefile:string;
    serialkey:string;
    created:string;
    creator:string;
    updated:string;
    updator:string;
  }
