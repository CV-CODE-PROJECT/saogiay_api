import { UserRole } from '@prisma/client';

export interface AuthUser {
  sub: string;
  email: string;
  fullName: string;
  role: UserRole;
  jti: string;
  exp: number;
}
