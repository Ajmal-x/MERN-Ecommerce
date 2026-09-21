import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.error(
      "MongoDB URI is missing. Please set MONGODB_URI or MONGO_URI in backend/.env"
    );
    process.exit(1);
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      retryWrites: true,
      w: "majority",
    });
  } catch (error) {
console.log("Database name:", mongoose.connection.db.databaseName);
    process.exit(1);
  }
};

export default connectDB;