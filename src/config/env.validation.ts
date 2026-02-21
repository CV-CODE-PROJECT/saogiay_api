import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().required(),
//   DATABASE_URL: Joi.string().required(),
//   JWT_SECRET: Joi.string().required().min(32),
});