import config from "config";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const dbUri = `mongodb://${config.get("mongo.host")}:${config.get(
  "mongo.port"
)}/${config.get("mongo.db")}`;

const mongoConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await mongoose.connect(dbUri, {
      useUnifiedTopology: true,
    } as any);
    console.log("Connected to MongoDB");
    next();
  } catch (err) {
    next(err);
  }
};

export default mongoConnection;
