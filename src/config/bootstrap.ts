import { config } from 'dotenv';

declare let process: {
  env: {
    NODE_ENV: string;
    DB_URI: string;
    DB_USER: string;
    DB_PASS: string;
    JWT_SECRET: string;
    LIMIT_REQUESTS_BY_PERIOD: string;
    RATE_LIMIT_IN_SECONDS: string;
  };
};

config();

export const { DB_URI } = process.env;
export const { DB_USER } = process.env;
export const { DB_PASS } = process.env;
export const { JWT_SECRET } = process.env;
export const { LIMIT_REQUESTS_BY_PERIOD } = process.env;
export const { RATE_LIMIT_IN_SECONDS } = process.env;
