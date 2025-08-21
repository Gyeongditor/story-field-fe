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
