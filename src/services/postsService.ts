import bcrypt from "bcrypt";
import database from "../dataSource";
import { Posts } from "../entities/Posts";
import { User } from "../entities/User";

const createPosts = async (
  title: string,
  content: string,
  password: string,
  userId: number
) => {
  const saltRound = 8;
  const salt = await bcrypt.genSalt(saltRound);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User();
  user.id = userId;
  const posts = new Posts();
  posts.title = title;
  posts.content = content;
  posts.password = hashedPassword;
  posts.user = user;
  await database.manager.save(posts);
};

export = { createPosts };
