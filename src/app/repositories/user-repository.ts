import { User, UserCreate, UserFindByEmail } from '@shared/types/user';

import { User as UserModel } from '../models';

export class UserRepository {
  private readonly user = UserModel;

  async findByEmail({ email, select }: UserFindByEmail): Promise<User | null> {
    return this.user.findOne(
      {
        email,
      },
      select,
    );
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return this.user.findOne({
      uuid,
    });
  }

  async create({ email, password }: UserCreate): Promise<User> {
    return (
      await this.user.create({
        email,
        password,
      })
    ).toObject();
  }

  async delete(uuid: string) {
    await this.user.findOneAndDelete({ uuid });
  }
}
