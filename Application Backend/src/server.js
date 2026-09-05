import database from "./config/database.js";
import dotenv from "dotenv";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

dotenv.config({
  path: "./.env",
});
database()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });