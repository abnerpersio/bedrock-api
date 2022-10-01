import mongoose from 'mongoose';

export type Secret = {
  _id?: mongoose.Types.ObjectId;
  safe?: mongoose.Types.ObjectId;
  uuid?: string;
  name?: string;
  secret?: string;
};

export type SecretCreateParams = {
  key: string;
  safe: {
    uuid: string;
  };
  params: {
    name: string;
    secret: string;
  };
};

export type SecretUpdateParams = {
  name: string;
  secret: string;
};

export type DecodeSearch = {
  key: string;
};

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
