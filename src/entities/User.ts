import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Posts } from "./Posts";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Posts, (posts) => posts.user)
  posts: Posts[];
}
