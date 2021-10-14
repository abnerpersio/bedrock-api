import { config } from 'dotenv';

config();

declare let process: {
  env: {
    DB_URI: string;
    DB_USER: string;
    DB_PASS: string;
  };
};

export const { DB_URI } = process.env;
export const { DB_USER } = process.env;
export const { DB_PASS } = process.env;
