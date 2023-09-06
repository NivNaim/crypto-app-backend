import config from "config";
import mongoose from "mongoose";
import { CustomRequest } from "../types/custom-request";
import { Response, NextFunction } from "express";

const dbUri = `mongodb://${config.get("mongo.host")}:${config.get(
  "mongo.port"
)}/${config.get("mongo.db")}`;

const mongoConnection = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to MongoDB");
    next();
  } catch (err) {
    next(err);
  }
};

export default mongoConnection;
