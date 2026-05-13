import express, { ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import habitRoutes from './routes/habitRoutes';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('MONGO_URI is not defined in the environment variables');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/', (req, res) => {
  res.send('Backend is alive');
});

app.use('/habits', habitRoutes);

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
};
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
