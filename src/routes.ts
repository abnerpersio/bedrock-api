import { Router } from 'express';

import { AuthMiddleware } from '@shared/middlewares/auth';

import { AddSafeController } from './app/controllers/add-safe';
import { AddSecretController } from './app/controllers/add-secret';
import { AddUserController } from './app/controllers/add-user';
import { DecodeSecretController } from './app/controllers/decode-secret';
import { DeleteSafeController } from './app/controllers/delete-safe';
import { DeleteSecretController } from './app/controllers/delete-secret';
import { DeleteUserController } from './app/controllers/delete-user';
import { GetUserController } from './app/controllers/get-user';
import { ListSafeController } from './app/controllers/list-safe';
import { ListSecretController } from './app/controllers/list-secret';
import { LoginController } from './app/controllers/login';
import { SearchSafeController } from './app/controllers/search-safe';
import { SearchSecretController } from './app/controllers/search-secret';
import { UpdateSafeController } from './app/controllers/update-safe';
import { UpdateSecretController } from './app/controllers/update-secret';
import { PingUseCase } from './app/useCases/ping';
import { ExpressAdapter } from './infra/adapters/express-adapter';

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

routes.get('/secrets', new ExpressAdapter(ListSecretController.create()).adapt);
routes.post('/secrets/search', new ExpressAdapter(SearchSecretController.create()).adapt);
routes.post('/secrets', new ExpressAdapter(AddSecretController.create()).adapt);
routes.put('/secrets/:uuid', new ExpressAdapter(UpdateSecretController.create()).adapt);
routes.delete('/secrets/:uuid', new ExpressAdapter(DeleteSecretController.create()).adapt);
routes.post('/secrets/:uuid/decode', new ExpressAdapter(DecodeSecretController.create()).adapt);
