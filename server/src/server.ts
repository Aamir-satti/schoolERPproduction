import mongoose from 'mongoose';
import app from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

const startServer = async () => {
  try {
    // Validate production environment
    if (env.NODE_ENV === 'production') {
      if (!env.MONGODB_URI || env.MONGODB_URI.includes('localhost')) {
        throw new Error('Production requires a valid MongoDB URI (not localhost)');
      }
      if (env.JWT_ACCESS_SECRET === 'dev_access_secret' || !env.JWT_ACCESS_SECRET) {
        throw new Error('Production requires a secure JWT_ACCESS_SECRET');
      }
      if (env.JWT_REFRESH_SECRET === 'dev_refresh_secret' || !env.JWT_REFRESH_SECRET) {
        throw new Error('Production requires a secure JWT_REFRESH_SECRET');
      }
    }

    await connectDatabase();
    
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Client URL: ${env.CLIENT_URL}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
