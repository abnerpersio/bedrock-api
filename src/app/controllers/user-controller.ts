import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { RequestError } from '@shared/errors/request-error';
import { IUser } from '@shared/interfaces/user';
import { verifiyHash } from '@shared/utils/hash';
import { generateToken } from '@shared/utils/jwt';

import { User } from '../models';

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

    const isPasswordVerified = verifiyHash(userFound.password, password);

    if (!isPasswordVerified) throw new RequestError('wrong passsword', 401);

    const token = generateToken({
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
