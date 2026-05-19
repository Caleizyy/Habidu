import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { notFoundHandler, errorHandler } from './middleware';

import habitRoutes from './routes/habitRoutes';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('MONGO_URI is not defined in the environment variables');

const app = express();

app.use(express.json());

app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/', (req, res) => {
  res.send('Backend is alive');
});

const apiRouter = express.Router();

app.use('/api', apiRouter);
apiRouter.use('/habits', habitRoutes);

app.use(notFoundHandler);

app.use(errorHandler);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
