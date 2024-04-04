export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  address: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  role: string;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: Date;
  address?: string;
  password?: string;
  isVerified?: boolean;
  [key: string]: unknown;
}

export interface AuthUser {
  id: string;
  role: string;
  exp: number;
}
