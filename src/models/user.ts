import { randomUUID } from 'crypto';
import mongoose from 'mongoose';
import { hash } from '../utils/hash';

const UserSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      set: (pass: string) => hash(pass),
      select: false,
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

mongoose.model('User', UserSchema, 'users');
