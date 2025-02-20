import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Database & Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ force: process.env.NODE_ENV === 'development' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  }); 