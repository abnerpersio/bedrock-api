import express, { Request, Response } from 'express';

import HeadersRemoverMiddleware from './middlewares/headers-remover';
import RateLimiterMiddlware from './middlewares/rate-limiter';

const app = express();

app.use(RateLimiterMiddlware);
app.use(HeadersRemoverMiddleware);

app.get('/', (req: Request, res: Response) => {
  res.send('Everything is ok here');
});

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
