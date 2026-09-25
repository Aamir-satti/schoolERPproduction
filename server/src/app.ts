import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

// Route imports
import authRoutes from './routes/auth';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import classRoutes from './routes/classes';
import subjectRoutes from './routes/subjects';
import timetableRoutes from './routes/timetables';
import attendanceRoutes from './routes/attendance';
import examRoutes from './routes/exams';
import marksRoutes from './routes/marks';
import resultRoutes from './routes/results';
import feeRoutes from './routes/fees';
import salaryRoutes from './routes/salaries';
import notificationRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/health', async (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      status: 'healthy',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/salaries', salaryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
