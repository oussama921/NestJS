import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordTransformer } from './password.transformer';
import { UserRoleEnum } from 'modules/rbac/user-role.enum';

@Entity({
  name: 'users',
})
export default class User {
  @PrimaryGeneratedColumn({name:"id"})
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 31, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  firstName: string;

  @Column({ length: 255, nullable: true })
  secondName: string;

  @Column({ length: 255, nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ length: 255, nullable: true })
  familyName: string;

  @Column({default: false})
  acceptCGU: boolean;

  @Column({default: false})
  hasVerifiedAccount: boolean;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer()
  })
  @Exclude()
  password: string;

  @Column({default: true})
  isActive: boolean;

  @Column({default: false})
  isBanned: boolean;

  @Column()
  role: UserRoleEnum;

  @Column({nullable: true })
  deletedAt: Date;

  @Column({nullable: true })
  height: number;

  @Column({nullable: true })
  shirtSize: number;

  @Column({nullable: true })
  weight: number;

  @Column({nullable: true })
  position: string;

  @Column({nullable: true })
  birthDate: Date;

  @Column({nullable: true })
  citizenship: string;

}
