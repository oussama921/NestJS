import { UserRoleEnum } from 'modules/rbac/user-role.enum';
// import { IRole } from 'nestjs-rbac';
export interface UserResultDB {
  id: number;
  email: string;
  phone: string;
  acceptCGU: boolean;
  hasVerifiedAccount: boolean;
  isBanned: boolean;
  isActive: boolean;
  role: UserRoleEnum;
}
