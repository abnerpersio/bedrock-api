import mongoose from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  uuid?: string;
  email?: string;
  password?: string;
}

export type UserFindByEmail = {
  email: string;
  select?: string;
};

export type UserCreate = {
  email: string;
  password: string;
};
