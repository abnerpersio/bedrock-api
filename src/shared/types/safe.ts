import mongoose from 'mongoose';

export type Safe = {
  _id?: mongoose.Types.ObjectId;
  owner?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  password?: string;
  secrets?: string[];
};

export type SafeCreate = {
  name: string;
  owner?: string;
};

export type SafeSearch = {
  owner: string;
  name?: string;
  id?: string;
  uuid?: string;
};

export type SafeFindByUuid = {
  owner: string;
  uuid: string;
};

export type SafeUpdate = {
  uuid: string;
  data: {
    name?: string;
  };
};

export type SafeDelete = {
  uuid: string;
  owner: string;
};
