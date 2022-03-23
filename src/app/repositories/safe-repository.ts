import mongoose from 'mongoose';

import {
  ISafe,
  SafeCreate,
  SafeDelete,
  SafeFindByUuid,
  SafeSearch,
  SafeUpdate,
} from '@shared/interfaces/safe';

import { Safe } from '../models';

export class SafeRepository {
  private readonly safe = Safe;

  async search({ owner, name, id, uuid }: SafeSearch): Promise<ISafe | null> {
    return this.safe.findOne({
      $and: [
        {
          $or: [{ name }, { _id: id }, { uuid }],
        },
        { owner },
      ],
    });
  }

  async findByUuid({ owner, uuid }: SafeFindByUuid): Promise<ISafe | null> {
    return this.safe.findOne({
      owner,
      uuid,
    });
  }

  async findAllByOwner(owner: string): Promise<ISafe[] | null> {
    return this.safe.find({
      owner,
    });
  }

  async create({ owner, name }: SafeCreate): Promise<ISafe> {
    return this.safe.create({
      owner,
      name,
    });
  }

  async update({ uuid, data }: SafeUpdate): Promise<ISafe | null> {
    return this.safe.findOneAndUpdate({ uuid }, data, { new: false });
  }

  async delete({ owner, uuid }: SafeDelete) {
    await this.safe.findOneAndDelete({ owner, uuid });
  }

  async addSecret(safeId: mongoose.Types.ObjectId, secretId: mongoose.Types.ObjectId) {
    return this.safe.findOneAndUpdate(
      {
        _id: safeId,
      },
      { $push: { secrets: secretId } },
    );
  }

  async deleteSecret(safeId?: mongoose.Types.ObjectId, secretId?: mongoose.Types.ObjectId) {
    if (!safeId || !secretId) return false;

    return this.safe.findOneAndUpdate(
      {
        _id: safeId,
      },
      { $pull: { secrets: secretId } },
    );
  }
}
