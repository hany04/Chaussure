// models/Scrutin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Admin = require('./Admin');

const Scrutin = sequelize.define('Scrutin', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  début: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fin: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  statut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Scrutin.belongsTo(Admin, { foreignKey: 'admin_id' }); // Relating Scrutin to Admin

module.exports = Scrutin;
