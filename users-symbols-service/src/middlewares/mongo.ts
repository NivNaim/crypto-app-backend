import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const dbUri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

const mongoConnection = async (
  req: Request,
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
