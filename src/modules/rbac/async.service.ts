import { ICacheRBAC, IDynamicStorageRbac, IStorageRbac } from 'nestjs-rbac';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { RBAC } from '.';


@Injectable()
export class AsyncService implements IDynamicStorageRbac {
  constructor(
    @Optional() @Inject('ICacheRBAC')
    private readonly cache?: ICacheRBAC,
  ) {

  }
  async getRbac(): Promise<IStorageRbac> {
    return new Promise((resolve) => {
      resolve(RBAC);
    });
  }
}
