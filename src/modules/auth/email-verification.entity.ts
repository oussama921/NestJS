import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity({
  name: 'EmailVerification',
})
export class EmailVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, default: null })
  emailToken: string;

  @CreateDateColumn({type: "timestamp"})
  createdAt: Date;

}
