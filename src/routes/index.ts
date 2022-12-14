import express, { Router } from "express";
import postsRouter from "./postsRouter";

const router: Router = express.Router();

router.use("/posts", postsRouter);

export default router;
