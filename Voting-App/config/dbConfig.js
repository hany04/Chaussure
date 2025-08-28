// dbConfig.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://yourusername:yourpassword@localhost:5432/voting-app', {
  dialect: 'postgres',
  logging: false, // Optional: Disable SQL query logging
});

module.exports = sequelize;
