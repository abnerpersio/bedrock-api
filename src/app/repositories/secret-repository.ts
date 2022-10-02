import mongoose from 'mongoose';

import {
  Secret,
  SecretCreate,
  SecretFindByOnwner,
  SecretFindByUuid,
  SecretSearch,
  SecretUpdate,
} from '@shared/types/secret';

import { Secret as SecretModel } from '../models';

export class SecretRepository {
  private readonly secret = SecretModel;

  async search({ owner, name, id, uuid }: SecretSearch): Promise<Secret | null> {
    return this.secret.findOne({
      $or: [{ name }, { _id: id }, { uuid }],
      owner,
    });
  }

  async findAllByIds(secretsIds?: string[]): Promise<Secret[]> {
    return this.secret.find({ _id: { $in: secretsIds } });
  }

  async findAllByOwner({ safeId, owner }: SecretFindByOnwner): Promise<Secret[]> {
    return this.secret.find({
      $or: [{ safe: new mongoose.mongo.ObjectId(safeId) }],
      owner,
    });
  }

  async findByUuid({ uuid, owner, select }: SecretFindByUuid): Promise<Secret | null> {
    return this.secret.findOne({ uuid, owner }, select);
  }

  async create({ owner, name, secret, key, safeId }: SecretCreate): Promise<Secret> {
    return this.secret.create({
      name: name,
      secret: {
        secret: secret,
        key,
      },
      safe: safeId,
      owner,
    });
  }

  async update({ uuid, data }: SecretUpdate) {
    return this.secret.findOneAndUpdate(
      { uuid },
      { name: data.name, secret: data.secret },
      { new: false },
    );
  }

  async delete(uuid: string) {
    return this.secret.findOneAndDelete({
      uuid,
    });
  }
}
