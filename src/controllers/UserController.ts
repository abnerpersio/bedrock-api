import { Request, Response } from 'express';

import mongoose from 'mongoose';
import { IUser } from '../interfaces/user';
import { User } from '../models';
import { verifiyHash } from '../utils/hash';
import { generateToken } from '../utils/jwt';

export class UserController {
  private User = User;

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'email and password are required fields',
      });

      return;
    }

    const user: mongoose.Document|null = await this.User.findOne({
      email,
    }, 'uuid email password');

    const userFound: IUser|undefined = user?.toObject();

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

    const token = await generateToken({
      id: userFound._id,
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
