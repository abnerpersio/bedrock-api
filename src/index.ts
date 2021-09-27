import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Everything is ok here');
});

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
