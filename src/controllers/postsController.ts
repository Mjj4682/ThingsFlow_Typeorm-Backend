import asyncHandler from "express-async-handler";
import { errorConstructor } from "../middlewares/errorConstructor";
import * as postsService from "../services/postsService";

const createPosts = asyncHandler(async (req, res) => {
  const { title, content, password, userId } = req.body;
  if (!title || !content || !password || !userId) {
    throw new errorConstructor(400, "필수값이 없습니다.");
  }
  if (title.length > 20 || content.length > 200) {
    throw new errorConstructor(
      400,
      "제목은 최대 20자, 본문은 최대 200자 입니다."
    );
  }
  const reg = /^(?=.*?[0-9]).{6,}$/;
  if (!reg.test(password)) {
    throw new errorConstructor(
      400,
      "비밀번호는 6자 이상, 숫자가 1개 포함되어야 합니다."
    );
  }
  await postsService.createPosts(title, content, password, userId);
  res.status(201).json({ message: "created posts" });
});

const updatePosts = asyncHandler(async (req, res) => {
  const postsId = Number(req.params.postsId);
  const { title, content, password } = req.body;
  if ((!title && !content) || !postsId || !password) {
    throw new errorConstructor(400, "필수값이 없습니다.");
  }
  await postsService.updatePosts(postsId, title, content, password);
  res.status(200).json({ message: "updated posts" });
});

const deletePosts = asyncHandler(async (req, res) => {
  const postsId = Number(req.params.postsId);
  const { password } = req.body;
  if (!postsId || !password) {
    throw new errorConstructor(400, "필수값이 없습니다.");
  }
  await postsService.deletePosts(postsId, password);
  res.status(204).json({});
});

const getPostsList = asyncHandler(async (req, res) => {
  const pageNo = Number(req.query.page);
  const postsList = await postsService.getPostsList(pageNo);
  res.status(200).json({ postsList });
});

export { createPosts, updatePosts, deletePosts, getPostsList };
