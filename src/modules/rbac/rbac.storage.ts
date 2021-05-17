import { IStorageRbac } from '.';
import { UserRoleEnum } from './user-role.enum';


export const RBAC: IStorageRbac = {
  roles: [UserRoleEnum.SUPER_ADMIN, 
          UserRoleEnum.ADMIN, 
          UserRoleEnum.FINAL_USER,
          UserRoleEnum.EDITOR],
  permissions: {
    user: ['create', 'update', 'delete','list'],
    // playerProfil: ['create', 'update', 'toggleAtivation'],
    // team: ['create', 'update', 'delete'],
    // permission3: ['filter1', 'filter2', RBAC_REQUEST_FILTER],
    // permission4: ['create', 'update', 'delete'],
  },
  grants: {
    SUPER_ADMIN: ['&admin' ,'user@list'],
    ADMIN: ['&non_authenticated_user' ,'user@list', "reservePlayer@changeDisponibility" ],
    captain: ['&non_authenticated_user' ,'&player'],
    player: ['&non_authenticated_user' ,'playerProfil'],
    collaborator: ['&non_authenticated_user' ,],
    non_authenticated_user: ["stadium@listAll", "stadium@getOne",],
  },
  filters: {
    // filter1: TestFilterOne,
    // filter2: TestFilterTwo,
    // [RBAC_REQUEST_FILTER]: RequestFilter,
  }
};
