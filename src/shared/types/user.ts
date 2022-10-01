import mongoose from 'mongoose';

export type User = {
  _id?: mongoose.Types.ObjectId;
  uuid?: string;
  email?: string;
  password?: string;
};

export type UserFindByEmail = {
  email: string;
  select?: string;
};

export type UserCreate = {
  email: string;
  password: string;
};

export type Auth = {
  id: string;
  uuid: string;
  token: string;
  email: string;
};
