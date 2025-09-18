// User Entity Types

export interface User {
  uuid: string;
  email?: string;
  name?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  Authorization: string[];
  "Refresh-Token": string[];
  userUUID: string[];
}

// Auth State
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

// API Response Types
export interface LoginResponse {
  data: AuthResponse;
}

export interface UserProfileResponse {
  data: User;
}

// Profile Management API Types
export interface UserProfileData {
  email: string;
  username: string;
}

export interface UserProfileUpdateRequest {
  email?: string;
  password?: string;
  username?: string;
}

export interface UserProfileGetResponse {
  status: number;
  code: string;
  message: string;
  data: UserProfileData;
}

export interface UserProfileUpdateResponse {
  status: number;
  code: string;
  message: string;
  data: null;
}

export interface UserDeleteResponse {
  status: number;
  code: string;
  message: string;
  data: null;
}
