// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  cin_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash password before saving the user (like Mongoose `pre('save')`)
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Method to check if passwords match (like Mongoose's `matchPassword`)
User.prototype.matchPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
