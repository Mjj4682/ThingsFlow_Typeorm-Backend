import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Weather } from "./Weather";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
  })
  title: string;

  @Column({
    length: 200,
  })
  content: string;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Weather, (weather) => weather.posts)
  @JoinColumn()
  weather: Weather;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
