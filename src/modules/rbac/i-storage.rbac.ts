import { IFilterPermission } from 'nestjs-rbac';

export interface IStorageRbac {
  roles: string[];
  permissions: object;
  grants: object;
  filters: { [key: string]: any | IFilterPermission };
}
