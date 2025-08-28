const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ message: 'User not found!' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

module.exports = { register, login };
