import Joi from "joi";

const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  github_id: Joi.string(),
});

export { userSchema };
