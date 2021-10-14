import mongoose from 'mongoose';
import { DB_URI, DB_USER, DB_PASS } from './bootstrap';

mongoose.connect(DB_URI, {
  user: DB_USER,
  pass: DB_PASS,
  dbName: 'bedrockapi',
})
  .then(() => console.log('Connected to DB!'))
  .catch((error) => console.log('Error connecting DB', error));
