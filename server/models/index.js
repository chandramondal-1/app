const sequelize = require('../config/database');
const User = require('./User');
const Attendance = require('./Attendance');
const Product = require('./Product');
const StockMovement = require('./StockMovement');

// Associations
// User <-> Attendance (1:M)
User.hasMany(Attendance, { foreignKey: 'user_id', as: 'attendances' });
Attendance.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product <-> StockMovement (1:M)
Product.hasMany(StockMovement, { foreignKey: 'product_id', as: 'movements' });
StockMovement.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// We export the models and the sequelize instance
module.exports = {
  sequelize,
  User,
  Attendance,
  Product,
  StockMovement,
};
