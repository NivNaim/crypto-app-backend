import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

import User from "../../models/user";
import { CustomRequest } from "../../types/custom-request";

import * as dotenv from "dotenv";
dotenv.config();

export const generateAuthToken = (userId: string): string => {
  const tokenSecret = process.env.TOKEN_SECRET as Secret;

  const token = jwt.sign({ userId: userId }, tokenSecret, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
  return token;
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).send("Email already registered");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ email, password: hashedPassword });
    console.log("User registered successfully");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const token = generateAuthToken(user._id);
    console.log(token);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
    });
    res.json({ authToken: token });
  } catch (err) {
    next(err);
  }
};

export const logout = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  res.send("logout");
};
