export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  address: string;
  password: string;
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
  dob?: Date;
  address?: string;
  password?: string;
  is_verified?: boolean;
  [key: string]: any;
}

export interface AuthUser {
  id: string;
  role: string;
}
declare module "express" {
  interface Request {
    authUser?: AuthUser;
  }
}
