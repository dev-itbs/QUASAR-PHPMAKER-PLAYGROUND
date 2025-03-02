// src/types/auth.ts
export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface User {
    id: number;
    username: string;
    email: string;
    permissions: string[];
    // Add other user fields as needed
  }
  
  export interface AuthResponse {
    success: boolean;
    data: {
      token: string;
      user: User;
    };
    message?: string;
  }