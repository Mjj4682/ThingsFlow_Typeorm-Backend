import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Posts } from "./Posts";

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Posts, (posts) => posts.weather)
  posts: Posts[];
}
