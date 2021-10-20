import mongoose from 'mongoose';

export interface ISecret {
  _id?: mongoose.Types.ObjectId;
  safe?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  secret?: string;
}
