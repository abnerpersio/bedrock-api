import mongoose from 'mongoose';
import { DB_URI, DB_USER, DB_PASS } from './bootstrap';

import '../models/User';
import '../models/Safe';
import '../models/Secret';

mongoose.connect(DB_URI, {
  user: DB_USER,
  pass: DB_PASS,
  dbName: 'bedrockapi',
})
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.log('Error connecting DB', error));

export const User = mongoose.model('User');
export const Safe = mongoose.model('Safe');
export const Secret = mongoose.model('Secret');
