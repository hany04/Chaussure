// sync.js
const sequelize = require('./config/dbConfig');
const Admin = require('./models/Admin');
const Scrutin = require('./models/Scrutin');
const User = require('./models/User');
const OptionVote = require('./models/OptionVote');
const Vote = require('./models/Vote');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // Use `{ force: true }` only for initial sync (it drops and recreates tables)
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

syncDatabase();
