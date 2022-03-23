import mongoose from 'mongoose';

import {
  ISecret,
  SecretCreate,
  SecretFindByOnwner,
  SecretFindByUuid,
  SecretSearch,
  SecretUpdate,
} from '../../shared/interfaces/secret';
import { Secret } from '../models';

export class SecretRepository {
  private readonly secret = Secret;

  async search({ owner, name, id, uuid }: SecretSearch): Promise<ISecret | null> {
    return this.secret.findOne({
      $or: [{ name }, { _id: id }, { uuid }],
      owner,
    });
  }

  async findAllByIds(secretsIds?: string[]): Promise<ISecret[] | null> {
    return this.secret.find({ _id: { $in: secretsIds } });
  }

  async findAllByOwner({ safeId, owner }: SecretFindByOnwner): Promise<ISecret[] | null> {
    return this.secret.find({
      $or: [{ safe: new mongoose.mongo.ObjectId(safeId) }],
      owner,
    });
  }

  async findByUuid({ uuid, owner, select }: SecretFindByUuid): Promise<ISecret | null> {
    return this.secret.findOne({ uuid, owner }, select);
  }

  async create({ owner, name, secret, key, safeId }: SecretCreate): Promise<ISecret> {
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
