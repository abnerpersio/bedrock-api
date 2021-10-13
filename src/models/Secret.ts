import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const SecretSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      unique: true,
      set: () => randomUUID(),
    },
    safe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Safe',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

mongoose.model('Secret', SecretSchema, 'secrets');
