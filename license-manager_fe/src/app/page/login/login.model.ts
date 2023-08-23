export interface PartyDetails {
    membership?: string;
    domainUser?: string;
    nonrepudiation?:boolean;
  }

  export interface VerifyDomainUser {
    result: boolean;
  }

  export interface VerifyDomainUserInput{
    signed:string;
  }

  export class Client {
    grant_type = 'client_credentials';
    SCOPE = 'SystemDashboardResource.scope1';
  }
