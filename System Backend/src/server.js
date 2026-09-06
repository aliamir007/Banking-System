import "dotenv/config";

import database from "./config/database.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is missing from .env");
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

database()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });