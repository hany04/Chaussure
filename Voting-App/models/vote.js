// models/Vote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User');
const Scrutin = require('./Scrutin');
const OptionVote = require('./OptionVote');

const Vote = sequelize.define('Vote', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  voterHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horodadata: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  txHash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Vote.belongsTo(User, { foreignKey: 'user_id' }); // Relating Vote to User
Vote.belongsTo(Scrutin, { foreignKey: 'scrutin_id' }); // Relating Vote to Scrutin
Vote.belongsTo(OptionVote, { foreignKey: 'option_id' }); // Relating Vote to OptionVote

module.exports = Vote;
