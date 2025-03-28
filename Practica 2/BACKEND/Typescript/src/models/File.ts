import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 500 })
  url!: string;

  @ManyToOne(() => User, (user) => user.files, { onDelete: "CASCADE" })
  user!: User;
}
