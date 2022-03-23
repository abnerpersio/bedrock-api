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

export type SecretFindByOnwner = {
  owner: string;
  safeId?: mongoose.Types.ObjectId;
};

export type SecretFindByUuid = {
  uuid: string;
  owner: string;
  select?: string;
};

export type SecretSearch = {
  owner: string;
  name?: string;
  id?: string;
  uuid?: string;
};

export type SecretCreate = {
  owner: string;
  name: string;
  secret: string;
  key: string;
  safeId: mongoose.Types.ObjectId;
};

export type SecretUpdate = {
  uuid: string;
  data: {
    name?: string;
    secret?: string;
  };
};
