import asyncHandler from "express-async-handler";
import { errorConstructor } from "../middlewares/errorConstructor";
import postsService from "../services/postsService";

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
  res.status(201).json({ message: "created post" });
});

export = { createPosts };
