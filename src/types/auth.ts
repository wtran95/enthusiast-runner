// User interface - matches backend User model
export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
}

// AuthState interface - what the context stores
export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// AuthContextType interface - what functions/state the context provides

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

// LoginRequest, RegisterRequest - API request types

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}
// AuthResponse - API response type
export interface AuthResponse {
  token: string;
  user: User;
}
