import { Request, Response, Router } from 'express';

import { SafeController } from '@controllers/safe-controller';
import { SecretController } from '@controllers/secret-controller';
import { UserController } from '@controllers/user-controller';
import AuthMiddleware from '@shared/middlewares/auth';

import { SafeRepository } from './app/repositories/safe-repository';
import { SecretRepository } from './app/repositories/secret-repository';
import { UserRepository } from './app/repositories/user-repository';

const userRepository = new UserRepository();
const userController = new UserController(userRepository);

const safeRepository = new SafeRepository();
const safeController = new SafeController(safeRepository);

const secretRepository = new SecretRepository();
const secretController = new SecretController(secretRepository, safeRepository);

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
routes.post('/safes/search', safeController.search);
routes.post('/safes', safeController.store);
routes.put('/safes/:uuid', safeController.update);
routes.delete('/safes/:uuid', safeController.delete);

routes.get('/secrets', secretController.list);
routes.post('/secrets/search', secretController.search);
routes.post('/secrets', secretController.store);
routes.put('/secrets/:uuid', secretController.update);
routes.delete('/secrets/:uuid', secretController.delete);
routes.post('/secrets/:uuid/decode', secretController.decode);

export default routes;
