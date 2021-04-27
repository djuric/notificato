import connectDb from './db';
import apiServer from './api';

(async () => {
  await connectDb();
  await apiServer();
})();
