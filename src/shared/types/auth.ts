export interface SignupRequestBody {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface VerifyResponseData {
  email: string;
  username: string;
}

export interface UserProfile {
  id?: string;
  email: string;
  username: string;
  [key: string]: unknown;
}

export interface LoginSuccessData {
  accessToken: string;
  user: UserProfile;
}


