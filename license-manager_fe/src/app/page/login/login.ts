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

  export interface Login {
    id: number;
    domainUser: string;
    region: string;
    district: string;
    branch: string;
    beneficiary: boolean;
    supervisor: boolean;
  }

