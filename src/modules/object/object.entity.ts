import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'objects',
})
export default class Objet {
  @PrimaryGeneratedColumn({name:"id"})
  id: number;

  @Column({ length: 255,nullable: true})
  code: string;

  @Column({nullable: true ,default: () => 'CURRENT_TIMESTAMP'})
  date: Date;

  @Column({ length: 255,nullable: true })
  item: string;

  @Column({ nullable: true })
  quantity: number;

  @Column({ length: 255,nullable: true })
  place: string;

}
