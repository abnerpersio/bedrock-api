import { Request, Response, Router } from 'express';

import { UserController } from './controllers/UserController';
import AuthMiddleware from './middlewares/auth';

const userController = new UserController();

const routes = Router();

routes.get('ping', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Everything is ok here' });
});

routes.post('/users', userController.store);
routes.post('/login', userController.login);

routes.use(AuthMiddleware);

routes.get('/users', userController.index);
routes.delete('/users', userController.delete);

export default routes;
