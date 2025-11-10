// Interfaces para la gestión de usuarios en el sistema
export interface User {
  id: string;
  fullname: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface UpdateUserInput {
  id: string;
  fullname?: string;
  email?: string;
  password?: string;
}

export interface SignupInput {
  fullname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const ValidRoles = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type ValidRoles = typeof ValidRoles[keyof typeof ValidRoles];

// Interfaces para formularios
export interface UserFormData {
  fullname: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UpdateUserFormData {
  fullname: string;
  email: string;
  password?: string;
  roles: string[];
}