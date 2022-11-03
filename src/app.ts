import express from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
  app.use(routes);
  return app;
};

export default createApp;
