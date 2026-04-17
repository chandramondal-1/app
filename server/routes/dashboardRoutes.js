const express = require('express');
const router = express.Router();
const { User, Attendance, Product, StockMovement } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

router.get('/summary', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const totalEmployees = await User.count({ where: { role: 'employee' } });
    
    const presentToday = await Attendance.count({ 
      where: { date: todayStr } 
    });

    const products = await Product.findAll();
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.quantity <= p.low_stock_level).length;

    // Optional: Today's stock movements
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const modernMovements = await StockMovement.count({
      where: {
        date: {
          [Op.gte]: todayStart
        }
      }
    });

    res.json({
      totalEmployees,
      presentToday,
      absentToday: totalEmployees - presentToday,
      totalProducts,
      lowStockItems,
      todayStockMovements: modernMovements,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching dashboard stats: ' + error.message });
  }
});

module.exports = router;
