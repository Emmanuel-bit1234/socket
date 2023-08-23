export interface UserModel {
  name: string;
  admin: boolean;
  grant?: {
    id: number;
    domainUser: string;
    region: string;
    district: string;
    branch: string;
    beneficiary: boolean;
    supervisor: boolean;
  };
  security: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
  };
}
