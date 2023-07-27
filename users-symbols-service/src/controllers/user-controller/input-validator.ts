import Joi from "joi";

const symbolSchema = Joi.object({
  symbol: Joi.string().required().min(3).max(7).alphanum().uppercase(),
});

export { symbolSchema };
