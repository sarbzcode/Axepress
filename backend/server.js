// server.js
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import noticesRoutes from './routes/notices.js';
import usersRoutes from './routes/users.js';
import eventRoutes from './routes/events.js';
import categoriesRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  "https://axepress-6fic.vercel.app",
  "https://axepress.vercel.app",
  "http://localhost:5173", // for local development (optional)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ✅ Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hour
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  },
}));

// ✅ Routes
app.use('/api/notices', noticesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// ✅ Root route
app.get('/', (req, res) => res.send('Backend running on Render'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
