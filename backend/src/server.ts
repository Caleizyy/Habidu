import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
import mongoose from 'mongoose';
import sessionRoutes from './routes/sessionRoutes';
import cookieParser from 'cookie-parser';
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) throw new Error('MONGO_URI is not defined in the environment variables');

const app = express();

const allowedOrigins = ['' + process.env.GOOGLE_REDIRECT_URI];

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Set up API routes
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/session', sessionRoutes);

app.get('/', (req, res) => {
  res.send('Backend is alive');
});

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
