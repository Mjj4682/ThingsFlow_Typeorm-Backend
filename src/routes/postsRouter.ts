import express, { Router } from "express";
import * as postController from "../controllers/postsController";

const router: Router = express.Router();

router.post("/", postController.createPosts);

router.patch("/:postsId", postController.updatePosts);

router.delete("/:postsId", postController.deletePosts);

router.get("/?", postController.getPostsList);

export default router;
