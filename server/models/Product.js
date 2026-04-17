const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  purchase_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  selling_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  low_stock_level: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Product;
