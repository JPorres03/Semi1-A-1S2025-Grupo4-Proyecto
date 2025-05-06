import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User.models';
import { Translation } from './Translation.models';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  // Relación con User
  @ManyToOne(() => User, user => user.files)
  user!: User;

  // Relación con Translation
  @OneToMany(() => Translation, translation => translation.file)
  translations!: Translation[];

  @Column({ length: 500 })
  url!: string;
}