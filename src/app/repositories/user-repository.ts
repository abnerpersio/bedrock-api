import { IUser, UserCreate, UserFindByEmail } from '@shared/interfaces/user';

import { User } from '../models';

export class UserRepository {
  private readonly user = User;

  async findByEmail({ email, select }: UserFindByEmail): Promise<IUser | null> {
    return this.user.findOne(
      {
        email,
      },
      select,
    );
  }

  async findByUuid(uuid: string): Promise<IUser | null> {
    return this.user.findOne({
      uuid,
    });
  }

  async create({ email, password }: UserCreate): Promise<IUser> {
    return this.user.create({
      email,
      password,
    });
  }

  async delete(uuid: string) {
    await this.user.findOneAndDelete({ uuid });
  }
}
