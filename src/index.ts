import './config/database';
import './config/bootstrap';

import app from './server';

const { PORT } = process.env;

app.listen(PORT || 3000, () => console.log(`Server is running at http://localhost:${PORT}`));
