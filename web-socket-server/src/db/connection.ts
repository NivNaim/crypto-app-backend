import mongoose from "mongoose";
import config from "config";

const dbConnection = async () => {
  const dbUri = `mongodb://${config.get("mongo.host")}:${config.get(
    "mongo.port"
  )}/${config.get("mongo.db")}`;

  try {
    await mongoose.connect(dbUri, {
      useUnifiedTopology: true,
    } as any);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default dbConnection;
