import { Request, Response } from 'express';
import mongoose from 'mongoose';

export class UserController {
  private User = mongoose.model('User');

  store = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'email and password are required fields',
      });

      return;
    }

    const createdUser = await this.User.create({
      email,
      password,
    });

    res.json({
      success: true,
      data: createdUser,
    });
  };
}
