require('dotenv/config');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Import and use API handlers (using dynamic import for ES modules)
(async () => {
  const healthHandler = await import('./api/health.js');
  app.get('/api/health', (req, res) => healthHandler.default(req, res));

  const paymentsHandler = await import('./api/payments.js');
  app.get('/api/payments', (req, res) => paymentsHandler.default(req, res));

  const statsHandler = await import('./api/stats.js');
  app.get('/api/stats', (req, res) => statsHandler.default(req, res));

  // Error handling
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: err.message
    });
  });

  app.listen(port, () => {
    console.log(`Development server running on port ${port}`);
    console.log(`CORS enabled for Vite dev server`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})();
