const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const scrutinRoutes = require('./routes/scrutinRoutes');
const voteRoutes = require('./routes/voteRoutes');
const sequelize = require('./config/dbConfig');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request body

// Routes
app.use('/api/users', userRoutes);
app.use('/api/scrutins', scrutinRoutes);
app.use('/api/votes', voteRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate(); // Connect to the database
    console.log('Database connected');
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
});
