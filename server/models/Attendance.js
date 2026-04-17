const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY, // 'YYYY-MM-DD'
    allowNull: false,
  },
  check_in_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  check_out_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  total_hours: {
    type: DataTypes.FLOAT, // stored as decimal hours
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late'),
    defaultValue: 'present',
  },
});

module.exports = Attendance;
