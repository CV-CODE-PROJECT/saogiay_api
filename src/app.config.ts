import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  // database: {
  //   url: process.env.DATABASE_URL,
  // },
  // auth: {
  //   jwtSecret: process.env.JWT_SECRET,
  // },
}));