import mongoose from "mongoose";
import { CustomRequest } from "../types/custom-request";
import { Response, NextFunction } from "express";

const dbUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

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
