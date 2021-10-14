import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { verifiyHash } from '../utils/hash';
import { generateToken } from '../utils/jwt';

interface IUser {
  _id?: mongoose.Types.ObjectId;
  uuid?: string;
  email?: string;
  password?: string;
}

export class UserController {
  private User = mongoose.model('User');

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'email and password are required fields',
      });

      return;
    }

    const userFound: IUser|null = await this.User.findOne({
      email,
    }).select('+password');

    if (!userFound) {
      res.status(404).json({
        success: false,
        message: 'user with this email was not found',
      });

      return;
    }

    const isPasswordVerified = verifiyHash(userFound.password, password);

    if (!isPasswordVerified) {
      res.status(401).json({
        success: false,
        message: 'wrong password',
      });

      return;
    }

    const token = generateToken({
      uuid: userFound.uuid,
      email: userFound.email,
    });

    res.json({
      success: true,
      data: { token },
    });
  }

  index = async (req: Request, res: Response) => {
    const { uuid } = req.auth;

    const userExists: IUser|null = await this.User.findOne({
      uuid,
    });

    if (!userExists) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      });

      return;
    }

    res.json({
      success: true,
      data: userExists,
    });
  };

  store = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'email and password are required fields',
      });

      return;
    }

    const userExists: IUser|null = await this.User.findOne({
      email,
    });

    if (userExists) {
      res.status(400).json({
        success: false,
        message: 'user with this email already exists',
      });

      return;
    }

    const createdUser: IUser = (
      await this.User.create({
        email,
        password,
      })
    ).toObject();

    delete createdUser.password;

    res.json({
      success: true,
      data: createdUser,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { uuid } = req.auth;

    const userExists: IUser|null = await this.User.findOne({
      uuid,
    });

    if (!userExists) {
      res.status(404).json({
        success: false,
        message: 'user not found',
      });

      return;
    }

    await this.User.findOneAndDelete({
      uuid,
    });

    res.sendStatus(204);
  };
}
