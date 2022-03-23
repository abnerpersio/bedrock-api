import { Request, Response } from 'express';

import { RequestError } from '@shared/errors/request-error';
import { verifiyHash } from '@shared/utils/hash';
import { generateToken } from '@shared/utils/jwt';

import { UserRepository } from '../repositories/user-repository';

export class UserController {
  private readonly userRepository = new UserRepository();

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new RequestError('email and password are required fields', 400);
    }

    const user = await this.userRepository.findByEmail({
      email,
      select: 'uuid email password',
    });

    if (!user) throw new RequestError('user with this email was not found', 404);

    const { password: userPassword, uuid } = user;

    const isPasswordVerified = verifiyHash(userPassword, password);

    if (!isPasswordVerified) throw new RequestError('wrong passsword', 401);

    const token = generateToken({
      id: user._id,
      uuid,
      email,
    });

    res.json({
      success: true,
      data: { token },
    });
  };

  index = async (req: Request, res: Response) => {
    const { uuid } = req.auth;

    const userExists = await this.userRepository.findByUuid(uuid);

    if (!userExists) throw new RequestError('user not found', 404);

    res.json({
      success: true,
      data: userExists,
    });
  };

  store = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) throw new RequestError('email and password are required fields', 400);

    const userExists = await this.userRepository.findByEmail({
      email,
    });

    if (userExists) throw new RequestError('user with this email already exists', 400);

    const user = await this.userRepository.create({
      email,
      password,
    });

    delete user.password;

    res.json({
      success: true,
      data: user,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { uuid } = req.auth;

    const userExists = await this.userRepository.findByUuid(uuid);

    if (!userExists) throw new RequestError('user not found', 404);

    await this.userRepository.delete(uuid);

    res.sendStatus(204);
  };
}
