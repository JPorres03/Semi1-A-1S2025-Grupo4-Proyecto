import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";
import { File } from "./File";



@Entity({ name: "User" }) 
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, length: 150 })
  username!: string;

  @Column({ unique: true, length: 200 })
  email!: string;

  @Column({ length: 150 })
  password!: string;

  @Column({ length: 250, nullable: true })
  profile_picture_url!: string;

  
}
