import { Router } from 'express';

import { SafeController } from '@controllers/safe-controller';
import { SecretController } from '@controllers/secret-controller';
import { AuthMiddleware } from '@shared/middlewares/auth';

import { AddUserController } from './app/controllers/add-user';
import { DeleteUserController } from './app/controllers/delete-user';
import { GetUserController } from './app/controllers/get-user';
import { LoginController } from './app/controllers/login';
import { SafeRepository } from './app/repositories/safe-repository';
import { SecretRepository } from './app/repositories/secret-repository';
import { PingUseCase } from './app/useCases/ping';
import { ExpressAdapter } from './infra/adapters/express-adapter';

const safeRepository = new SafeRepository();
const safeController = new SafeController(safeRepository);

const secretRepository = new SecretRepository();
const secretController = new SecretController(secretRepository, safeRepository);

export const routes = Router();

routes.get('/ping', new ExpressAdapter(new PingUseCase()).adapt);

routes.post('/users', new ExpressAdapter(AddUserController.create()).adapt);
routes.post('/login', new ExpressAdapter(LoginController.create()).adapt);

routes.use(AuthMiddleware);

routes.get('/users', new ExpressAdapter(GetUserController.create()).adapt);
routes.delete('/users', new ExpressAdapter(DeleteUserController.create()).adapt);

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
