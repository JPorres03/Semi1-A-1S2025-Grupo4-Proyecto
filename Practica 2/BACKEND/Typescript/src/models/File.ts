import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity({ name: "File" })
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;
  @Column({ length: 500 })
  url!: string;


}
