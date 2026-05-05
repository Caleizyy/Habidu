import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cors from 'cors';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Set up API routes
const apiRouter = express.Router();
app.use('/api', apiRouter);
apiRouter.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is alive');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
