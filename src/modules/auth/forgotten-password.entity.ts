import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity({
  name: 'ForgottenPassword',
})
export class ForgottenPassword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, default: null })
  newPasswordToken: string;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

}
