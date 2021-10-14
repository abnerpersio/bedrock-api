interface IAuth {
  uuid?: string;
  token?: string;
  email?: string;
}

declare namespace Express {
  export interface Request {
    auth: IAuth;
  }
}
