import {
  CreateSafe,
  DeleteSafe,
  FindByUuid,
  ISafe,
  SearchSafe,
  UpdateSafe,
} from '@shared/interfaces/safe';

import { Safe } from '../models';

export class SafeRepository {
  private Safe = Safe;

  async search({ owner, name, id, uuid }: SearchSafe): Promise<ISafe | null> {
    return this.Safe.findOne({
      $and: [
        {
          $or: [{ name }, { _id: id }, { uuid }],
        },
        { owner },
      ],
    });
  }

  async findByUuid({ owner, uuid }: FindByUuid): Promise<ISafe | null> {
    return this.Safe.findOne({
      owner,
      uuid,
    });
  }

  async findAllByOwner(owner: string): Promise<ISafe[] | null> {
    return this.Safe.find({
      owner,
    });
  }

  async create({ owner, name }: CreateSafe): Promise<ISafe> {
    return this.Safe.create({
      owner,
      name,
    });
  }

  async update({ uuid, data }: UpdateSafe): Promise<ISafe | null> {
    return this.Safe.findOneAndUpdate({ uuid }, data, { new: false });
  }

  async delete({ owner, uuid }: DeleteSafe) {
    await this.Safe.findOneAndDelete({ owner, uuid });
  }
}
