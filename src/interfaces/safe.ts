import mongoose from 'mongoose';

export interface IForeignSecret {
  secret: mongoose.Types.ObjectId;
}

export interface ISafe {
  _id?: mongoose.Types.ObjectId;
  owner?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  password?: string;
  secrets?: IForeignSecret[];
}

export interface ISafeSearch {
  name?: string;
  id?: string;
  uuid?: string;
}

export interface ISafeCreate {
  name: string;
}
