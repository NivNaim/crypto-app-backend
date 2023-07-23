import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

const inputValidator =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validateAsync(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export default inputValidator;
