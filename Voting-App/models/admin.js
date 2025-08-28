// models/Admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Admin;
