import database from "../dataSource";
import { Posts } from "../entities/Posts";
import { User } from "../entities/User";

const createPosts = async (
  title: string,
  content: string,
  password: string,
  userId: number
) => {
  const user = new User();
  user.id = userId;
  const posts = new Posts();
  posts.title = title;
  posts.content = content;
  posts.password = password;
  posts.user = user;
  await database.manager.save(posts);
};

export = { createPosts };
