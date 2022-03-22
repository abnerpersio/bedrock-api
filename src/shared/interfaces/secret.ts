import mongoose from 'mongoose';

export interface ISecret {
  _id?: mongoose.Types.ObjectId;
  safe?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  secret?: string;
}

export interface ISecretSearch {
  name?: string;
  id?: string;
  uuid?: string;
}

export interface ISecretCreate {
  key: string;
  safe: {
    uuid: string;
  };
  params: {
    name: string;
    secret: string;
  };
}

export interface ISecretUpdate {
  name: string;
  secret: string;
}

export interface IDecodeSearch {
  key: string;
}
