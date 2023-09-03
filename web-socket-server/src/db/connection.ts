import mongoose from "mongoose";
import { CustomConnectOptions } from "../types/custom-connect-options";



const dbConnection = async () => {
  const { MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

  if (!MONGO_HOST || !MONGO_PORT || !MONGO_DB) {
    console.error("MongoDB environment variables not set.");
    process.exit(1);
  }

  const dbUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

  const options: CustomConnectOptions = {
    useUnifiedTopology: true, // This option is recognized now
  };

  try {
    await mongoose.connect(dbUri, options);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default dbConnection;
