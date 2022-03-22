import { User } from '../../app/models';
import { defaultUser } from '../fixtures/user';

export const mockUserModel = () => {
  User.findById = jest.fn().mockResolvedValue(new User(defaultUser));
  User.findOne = jest.fn().mockResolvedValue(new User(defaultUser));
  User.create = jest.fn().mockResolvedValue(new User(defaultUser));
  User.findOneAndDelete = jest.fn().mockResolvedValue(true);
};
