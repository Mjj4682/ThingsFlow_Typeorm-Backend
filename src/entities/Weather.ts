import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Posts } from "./Posts";

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text", { nullable: true })
  name: string;

  @OneToMany(() => Posts, (posts) => posts.weather)
  posts: Posts[];
}
