import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

const SecretSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      unique: true,
      default: () => randomUUID(),
    },
    name: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    safe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Safe',
      required: true,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

mongoose.model('Secret', SecretSchema, 'secrets');
