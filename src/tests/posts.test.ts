import { describe, expect, test } from "@jest/globals";
import createApp from "../app";
import { testDatabase } from "../dataSource";
import * as Controller from "../controllers/postsController";
import httpMocks from "node-mocks-http";
import {
  NextFunction,
  Request,
  Response,
  Application,
} from "express-serve-static-core";
import { errorConstructor } from "../middlewares/errorConstructor";

describe("createApp", () => {
  let app: Application;
  beforeAll(async () => {
    app = createApp();
    await testDatabase.initialize();
  });

  afterAll(async () => {
    await testDatabase.query(`TRUNCATE posts`);
    await testDatabase.destroy();
  });

  test("정의", () => {
    expect(app).toBeDefined();
  });

  describe("createPosts", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    test("필수값 에러", async () => {
      req.body = {};
      await expect(Controller.createPosts(req, res, next)).rejects.toThrow(
        errorConstructor
      );
    });
    test("비밀번호 에러 (6자리 미만)", async () => {
      req.body = {
        title: "제목🤪",
        content: "내용🤪🤪",
        password: "6자리미만",
        userId: 1,
      };
      await expect(Controller.createPosts(req, res, next)).rejects.toThrow(
        errorConstructor
      );
    });
    test("비밀번호 에러 (숫자 미포함)", async () => {
      req.body = {
        title: "제목🤪",
        content: "내용🤪🤪",
        password: "여섯자리이상",
        userId: 1,
      };
      await expect(Controller.createPosts(req, res, next)).rejects.toThrow(
        errorConstructor
      );
    });
  });

  describe("updatePosts", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    test("필수값 에러", async () => {
      req.body = {
        title: "제목수정🤪",
        content: "내용수정🤪🤪",
        password: "여섯자리이상",
      };
      await expect(Controller.updatePosts(req, res, next)).rejects.toThrow(
        errorConstructor
      );
    });
  });

  describe("deletePosts", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    test("필수값 에러", async () => {
      req.body = {
        userId: 1,
      };
      await expect(Controller.deletePosts(req, res, next)).rejects.toThrow(
        errorConstructor
      );
    });
  });
});
