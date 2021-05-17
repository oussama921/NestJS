
import User from 'modules/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { UserRoleEnum } from './user-role.enum';

@Entity({
  name: 'UserRole',
})
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("enum", { enum: UserRoleEnum })
  public role: UserRoleEnum;

  @OneToMany(type => User, user => user.role)
  users: User[];

}
