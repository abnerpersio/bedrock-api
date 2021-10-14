import { Request, Response, Router } from 'express';

import { UserController } from './controllers/UserController';

const userController = new UserController();

const routes = Router();

routes.get('ping', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Everything is ok here' });
});

routes.post('/users', userController.store);

export default routes;
