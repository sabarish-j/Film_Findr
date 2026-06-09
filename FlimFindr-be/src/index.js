const express = require('express');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
require('dotenv').config();
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');
const aiRoutes = require('./routes/ai');

const app = express();

// Connect to database
connectDB();

const normalizeOrigin = (origin) => origin?.replace(/\/+$/, '');

const allowedOrigins = [
  ...(process.env.FRONTEND_URL || '').split(','),
  'http://localhost:5173',
  'http://localhost:3000',
].map((origin) => normalizeOrigin(origin.trim())).filter(Boolean);

// Middleware
app.use(compression());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  exposedHeaders: ['X-Cache'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (avatars etc.)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/user', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
