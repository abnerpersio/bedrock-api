import './config/database';
import './config/bootstrap';

import app from './server';

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
