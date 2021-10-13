import { Request, Response } from 'express';
import mongoose from 'mongoose';

export class UserController {
  private Secret = mongoose.model('Secret');

  private Safe = mongoose.model('Safe');

  private User = mongoose.model('User');

  index = async (req: Request, res: Response) => {
    res.sendStatus(200);
  }
}
