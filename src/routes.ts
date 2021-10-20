import { Request, Response, Router } from 'express';
import { SafeController } from './controllers/SafeController';
import { SecretController } from './controllers/SecretController';

import { UserController } from './controllers/UserController';
import AuthMiddleware from './middlewares/auth';

const userController = new UserController();
const safeController = new SafeController();
const secretController = new SecretController();

const routes = Router();

routes.get('/ping', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Everything is ok here' });
});

routes.post('/users', userController.store);
routes.post('/login', userController.login);

routes.use(AuthMiddleware);

routes.get('/users', userController.index);
routes.delete('/users', userController.delete);

routes.get('/safes', safeController.list);
routes.get('/safes/search', safeController.index);
routes.post('/safes', safeController.store);
routes.put('/safes/:uuid', safeController.update);
routes.delete('/safes/:uuid', safeController.delete);

routes.get('/secrets', secretController.list);
routes.get('/secrets/search', secretController.index);
routes.post('/secrets', secretController.store);
routes.put('/secrets/:uuid', secretController.update);
routes.delete('/secrets/:uuid', secretController.delete);
routes.get('/secrets/:uuid/decode', secretController.decode);

export default routes;
