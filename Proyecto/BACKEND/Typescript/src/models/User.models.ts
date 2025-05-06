import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Translation } from './Translation.models';
import { File } from './File.models';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150, unique: true })
  username!: string;

  @Column({ length: 200, unique: true })
  email!: string;

  @Column({ length: 150 })
  password!: string;

  @Column({ default: false })
  is_active!: boolean;

  @OneToMany(() => Translation, translation => translation.user)
  translations!: Translation[];

  @OneToMany(() => File, file => file.user)
  files!: File[];
}