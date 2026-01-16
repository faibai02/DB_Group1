import { postJSON, getJSON } from './http';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  error?: string;
}

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    const response = await postJSON<AuthResponse>('signin', {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Registration error');
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const response = await postJSON<AuthResponse>('login', {
      email: data.email,
      password: data.password,
    });
    return response;
  } catch (error: any) {
    throw new Error(error.message || 'Login error');
  }
}

export async function logout(): Promise<void> {
  try {
    await postJSON('logout', {});
  } catch (error: any) {
    console.error('Logout error:', error);
  }
}

export function isAuthenticated(): boolean {
  // Check if user has a valid auth cookie
  return document.cookie.includes('Authorisation');
}
