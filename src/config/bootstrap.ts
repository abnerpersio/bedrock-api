import { config } from 'dotenv';

config();

declare var process : {
  env: {
    DB_URI: string;
    DB_USER: string; 
    DB_PASS: string;
  }
}

export const DB_URI = process.env.DB_URI;
export const DB_USER =  process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;