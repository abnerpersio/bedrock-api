import { Router } from 'express';

import { SecretController } from '@controllers/secret-controller';
import { AuthMiddleware } from '@shared/middlewares/auth';

import { AddSafeController } from './app/controllers/add-safe';
import { AddUserController } from './app/controllers/add-user';
import { DeleteSafeController } from './app/controllers/delete-safe';
import { DeleteUserController } from './app/controllers/delete-user';
import { GetUserController } from './app/controllers/get-user';
import { ListSafeController } from './app/controllers/list-safe';
import { LoginController } from './app/controllers/login';
import { SearchSafeController } from './app/controllers/search-safe';
import { UpdateSafeController } from './app/controllers/update-safe';
import { SafeRepository } from './app/repositories/safe-repository';
import { SecretRepository } from './app/repositories/secret-repository';
import { PingUseCase } from './app/useCases/ping';
import { ExpressAdapter } from './infra/adapters/express-adapter';

const safeRepository = new SafeRepository();

const secretRepository = new SecretRepository();
const secretController = new SecretController(secretRepository, safeRepository);

export const routes = Router();

routes.get('/', new ExpressAdapter(new PingUseCase()).adapt);
routes.get('/ping', new ExpressAdapter(new PingUseCase()).adapt);

routes.post('/users', new ExpressAdapter(AddUserController.create()).adapt);
routes.post('/login', new ExpressAdapter(LoginController.create()).adapt);

routes.use(AuthMiddleware);

routes.get('/users', new ExpressAdapter(GetUserController.create()).adapt);
routes.delete('/users', new ExpressAdapter(DeleteUserController.create()).adapt);

routes.get('/safes', new ExpressAdapter(ListSafeController.create()).adapt);
routes.post('/safes/search', new ExpressAdapter(SearchSafeController.create()).adapt);
routes.post('/safes', new ExpressAdapter(AddSafeController.create()).adapt);
routes.put('/safes/:uuid', new ExpressAdapter(UpdateSafeController.create()).adapt);
routes.delete('/safes/:uuid', new ExpressAdapter(DeleteSafeController.create()).adapt);

routes.get('/secrets', secretController.list);
routes.post('/secrets/search', secretController.search);
routes.post('/secrets', secretController.store);
routes.put('/secrets/:uuid', secretController.update);
routes.delete('/secrets/:uuid', secretController.delete);
routes.post('/secrets/:uuid/decode', secretController.decode);
