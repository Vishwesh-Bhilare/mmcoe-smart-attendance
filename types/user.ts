// types/user.ts

export type UserRole = "student" | "faculty" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
}