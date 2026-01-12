export interface ICFAccount {
  _id: string;
  student_id: string;
  cf_account: string;
  is_verified_flag: boolean;
}

export type StartVerifyResponse = {
  verification_token: string;
  cf_code: string;
};
