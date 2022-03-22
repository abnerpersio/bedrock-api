import mongoose from 'mongoose';

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  uuid?: string;
  email?: string;
  password?: string;
}
