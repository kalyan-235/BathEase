require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Middleware
// Allow localhost (dev) + all deployed frontends (prod)
const ALLOWED_ORIGINS = [
  // Local development
  /^http:\/\/localhost(:\d+)?$/,

  // Vercel — all three BathEase domains
  'https://bath-ease.vercel.app',
  'https://bath-ease-git-main-kalyan-235s-projects.vercel.app',
  'https://bath-ease-ar34bz2zv-kalyan-235s-projects.vercel.app',

  // Generic pattern fallbacks
  /^https?:\/\/.*\.vercel\.app$/,
  /^https?:\/\/.*\.netlify\.app$/,
  /^https?:\/\/.*\.onrender\.com$/,
  /^https?:\/\/.*\.pages\.dev$/,
];

// Also honour an explicit FRONTEND_URL env var
if (process.env.FRONTEND_URL) {
  ALLOWED_ORIGINS.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    const allowed = ALLOWED_ORIGINS.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );

    if (allowed) return callback(null, true);
    console.warn(`CORS blocked: ${origin}`);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // 10mb for profile image base64

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookings', require('./routes/bookings'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'BathEase API running' }));

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`BathEase API running on port ${PORT}`));
