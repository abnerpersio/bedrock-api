import mongoose from 'mongoose';

import {
  Safe,
  SafeCreate,
  SafeDelete,
  SafeFindByUuid,
  SafeSearch,
  SafeUpdate,
} from '@shared/types/safe';

import { Safe as SafeModel } from '../models';

export class SafeRepository {
  private readonly safe = SafeModel;

  async search({ owner, name, id, uuid }: SafeSearch): Promise<Safe | null> {
    return this.safe.findOne({
      $and: [
        {
          $or: [{ name }, { _id: id }, { uuid }],
        },
        { owner },
      ],
    });
  }

  async findByUuid({ owner, uuid }: SafeFindByUuid): Promise<Safe | null> {
    return this.safe.findOne({
      owner,
      uuid,
    });
  }

  async findAllByOwner(owner: string): Promise<Safe[]> {
    return this.safe.find({
      owner,
    });
  }

  async create({ owner, name }: SafeCreate): Promise<Safe> {
    return this.safe.create({
      owner,
      name,
    });
  }

  async update({ uuid, data }: SafeUpdate): Promise<Safe | null> {
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
