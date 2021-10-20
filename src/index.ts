import './config/database';
import './config/bootstrap';

import app from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
