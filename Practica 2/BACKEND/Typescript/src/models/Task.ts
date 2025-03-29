import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 150 })
  title!: string;

  @Column({ length: 300, nullable: true })
  description!: string;

  @Column({ default: false })
  status!: boolean;

  @Column({ 
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at!: Date;
}


