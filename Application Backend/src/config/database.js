import mongoose from "mongoose";
import dns from "node:dns";

// Some networks fail SRV/TXT lookups for Atlas hostnames — this avoids that.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const database = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error: ", error.message);
    process.exit(1);
  }
};

export default database;