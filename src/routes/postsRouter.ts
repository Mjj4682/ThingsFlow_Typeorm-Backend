import express, { Router } from "express";
import postController from "../controllers/postsController";

const router: Router = express.Router();

router.post("/", postController.createPosts);

router.patch("/:postsId", postController.updatePosts);

router.delete("/:postsId", postController.deletePosts);

export default router;
