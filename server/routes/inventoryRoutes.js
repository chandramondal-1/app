const express = require('express');
const router = express.Router();
const { Product, StockMovement } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Get all products (Admin & Employee can view stock)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single product
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Add new product
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error creating product: ' + error.message });
  }
});

// Admin: Edit product
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error updating product: ' + error.message });
  }
});

// Admin: Delete product
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting product' });
  }
});

// Admin: Manage Stock IN / OUT
router.post('/:id/stock', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { type, quantity, note } = req.body;
    if (!['IN', 'OUT'].includes(type) || !quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Invalid stock movement data' });
    }

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (type === 'OUT' && product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // create movement
    const movement = await StockMovement.create({
      product_id: product.id,
      type,
      quantity,
      note
    });

    // update product quantity
    if (type === 'IN') {
      product.quantity += parseInt(quantity);
    } else {
      product.quantity -= parseInt(quantity);
    }
    await product.save();

    res.json({ message: 'Stock updated', product, movement });
  } catch (error) {
    res.status(500).json({ error: 'Error updating stock' });
  }
});

// Get Stock Movements
router.get('/:id/movements', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const movements = await StockMovement.findAll({
      where: { product_id: req.params.id },
      order: [['date', 'DESC']]
    });
    res.json(movements);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stock movements' });
  }
});

module.exports = router;
