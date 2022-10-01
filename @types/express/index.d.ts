declare namespace Express {
  export interface Request {
    auth: {
      id: string;
      uuid: string;
      token: string;
      email: string;
    };
  }
}
