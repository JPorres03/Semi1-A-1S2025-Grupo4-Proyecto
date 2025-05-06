import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../models/User.models';
import { File } from '../models/File.models';

@Entity()
export class Translation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.translations)
  user!: User;

  @ManyToOne(() => File, file => file.translations)
  file!: File;

  @Column({ length: 300, nullable: true })
  text!: string;

  @Column({ length: 150 })
  source_language!: string;

  @Column({ length: 150 })
  target_language!: string;

  @Column({ length: 300, nullable: true })
  audio_url!: string;
}