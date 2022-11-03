import asyncHandler from "express-async-handler";
import { errorConstructor } from "../middlewares/errorConstructor";
import postsService from "../services/postsService";

const createPosts = asyncHandler(async (req, res) => {
  const { title, content, password, userId } = req.body;
  if (!title || !content || !password || !userId) {
    throw new errorConstructor(400, "필수값이 없습니다.");
  }
  await postsService.createPosts(title, content, password, userId);
  res.status(201).json({ message: "created post" });
});

export = { createPosts };
