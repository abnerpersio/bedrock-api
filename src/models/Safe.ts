import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const SafeSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => randomUUID(),
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    secrets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Secret',
      },
    ],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

mongoose.model('Safe', SafeSchema, 'safes');
