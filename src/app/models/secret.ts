import { randomUUID } from 'crypto';
import mongoose from 'mongoose';

import { encrypt } from '@shared/utils/crypto';

interface ISecretObject {
  secret?: string;
  key?: string;
}

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
      select: false,
      set: (value: ISecretObject) => {
        const { secret, key } = value;

        if (!secret || !key) {
          throw new Error('invalid secret');
        }

        const encrypted = encrypt(secret, key);
        return encrypted;
      },
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
