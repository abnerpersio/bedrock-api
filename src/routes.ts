import { Request, Response, Router } from 'express';

import { UserController } from './controllers/UserController';

const userController = new UserController();

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Everything is ok here' });
});

routes.get('/users', userController.index);

export default routes;
