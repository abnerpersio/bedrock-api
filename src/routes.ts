import { Request, Response, Router } from 'express';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Everything is ok here' });
});

export default routes;
