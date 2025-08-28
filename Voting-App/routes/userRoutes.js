const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authenticateUser = require('./middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register a new user
router.post('/register', async (req, res) => {
  const { nom, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ nom, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in user' });
  }
});

// Get authenticated user (example route that requires authentication)
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    return res.status(200).json({ id: user.id, email: user.email, nom: user.nom });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = router;
