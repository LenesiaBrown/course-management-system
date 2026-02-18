import express from 'express';
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';


// Import routes
import coursesRoutes from './routes/coursesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';

config(); // Load environment variables from .env file
connectDB(); // Connect to the database

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/courses', coursesRoutes);
app.use('/auth', authRoutes);
app.use('/progress', progressRoutes);
app.use('/departments', departmentRoutes); 


const PORT = 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// Handle unhandled promise rejections (e.g. database connection errors)
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
  console.error('Uncaught Exception:', err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});