import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const SafeSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      unique: true,
      set: () => randomUUID(),
    },
    owner: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
