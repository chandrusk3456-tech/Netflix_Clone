const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'netflix-clone-secret-key-2024';

// ── Middleware ─────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// ── Mock User Database ─────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    email: 'user@netflix.com',
    password: 'netflix123',
    name: 'Netflix User',
    avatar: 'N',
    plan: 'Premium',
  },
  {
    id: 2,
    email: 'test@test.com',
    password: 'password',
    name: 'Test User',
    avatar: 'T',
    plan: 'Standard',
  },
  {
    id: 3,
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Demo Admin',
    avatar: 'D',
    plan: 'Basic',
  },
];

// ── Routes ─────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Netflix Clone API is running 🎬' });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Basic input validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a valid email address.',
    });
  }

  // Simulate a small delay (like a real DB call)
  setTimeout(() => {
    // Find user (case-insensitive email)
    const user = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Sorry, we can\'t find an account with this email address. Please try again or create a new account.',
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again or you can reset your password.',
      });
    }

    // Success — issue a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        plan: user.plan,
      },
    });
  }, 600); // 600ms simulated delay
});

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎬 Netflix Clone API running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log('\n📝 Mock Credentials:');
  MOCK_USERS.forEach((u) => {
    console.log(`   ${u.email} / ${u.password}`);
  });
  console.log('\n');
});
