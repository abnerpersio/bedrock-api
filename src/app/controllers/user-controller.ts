import { Request, Response } from 'express';

import mongoose from 'mongoose';
import { IUser } from '@shared/interfaces/user';
import { User } from '../models';
import { generateToken } from '@shared/utils/jwt';
import { RequestError } from '../../shared/errors/request-error';

export class UserController {
  private User = User;

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new RequestError('email and password are required fields', 400);
    }

    const user: mongoose.Document | null = await this.User.findOne(
      {
        email,
      },
      'uuid email password',
    );

    const userFound: IUser | undefined = user?.toObject();

    if (!userFound) throw new RequestError('user with this email was not found', 404);

    const token = await generateToken({
      id: userFound._id,
      uuid: userFound.uuid,
      email: userFound.email,
    });

    res.json({
      success: true,
      data: { token },
    });
  };

  index = async (req: Request, res: Response) => {
    const { uuid } = req.auth;

    const userExists: IUser | null = await this.User.findOne({
      uuid,
    });

    if (!userExists) throw new RequestError('user not found', 404);

    res.json({
      success: true,
      data: userExists,
    });
  };

  store = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) throw new RequestError('email and password are required fields', 400);

    const userExists: IUser | null = await this.User.findOne({
      email,
    });

    if (userExists) throw new RequestError('user with this email already exists', 400);

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

    const userExists: IUser | null = await this.User.findOne({
      uuid,
    });

    if (!userExists) throw new RequestError('user not found', 404);

    await this.User.findOneAndDelete({
      uuid,
    });

    res.sendStatus(204);
  };
}
