
import * as dotenv from 'dotenv';
dotenv.config();

export const Config = {
  PORT: process.env.PORT || 3000,
  GOOGLE_WEBHOOK_SECRET: process.env.GOOGLE_WEBHOOK_SECRET,
  WEBHOOK_ENDPOINT: process.env.WEBHOOK_ENDPOINT || '/webhook',
  NODE_ENV: process.env.NODE_ENV || 'development',
};

export const isProduction = Config.NODE_ENV === 'production';
