import createApp from "./app";
import database from "./dataSource";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;
  await database
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
      database.destroy();
    });
  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
