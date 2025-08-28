// models/OptionVote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Scrutin = require('./Scrutin');

const OptionVote = sequelize.define('OptionVote', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

OptionVote.belongsTo(Scrutin, { foreignKey: 'scrutin_id' }); // Relating OptionVote to Scrutin

module.exports = OptionVote;
