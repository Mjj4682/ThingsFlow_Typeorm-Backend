import bcrypt from "bcrypt";
import database from "../dataSource";
import { errorConstructor } from "../middlewares/errorConstructor";
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

const updatePosts = async (
  postsId: number,
  title: string,
  content: string,
  password: string
) => {
  const postsRepository = database.getRepository(Posts);
  const postsUpdate = await postsRepository.findOneBy({ id: postsId });
  if (!postsUpdate) {
    throw new errorConstructor(400, "틀린 게시물 아이디입니다.");
  }
  const checkPassword = await bcrypt.compare(password, postsUpdate.password);
  if (!checkPassword) {
    throw new errorConstructor(400, "틀린 비밀번호입니다.");
  }
  if (!title) {
    title = postsUpdate.title;
  }
  if (!content) {
    content = postsUpdate.content;
  }
  postsUpdate.title = title;
  postsUpdate.content = content;
  await postsRepository.save(postsUpdate);
};

export = { createPosts, updatePosts };
