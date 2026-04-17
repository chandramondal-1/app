require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route for Health Check
app.get('/', (req, res) => {
  res.send('SunSeating Server is successfully live on the internet!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Database Sync and Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Database synced');
  
  // Quick seed hook for an admin user if missing
  const { User } = require('./models');
  const bcrypt = require('bcrypt');
  
  User.findOne({ where: { email: 'admin@sunseating.com' } }).then(async (user) => {
    if (!user) {
      await User.create({
        name: 'Admin',
        email: 'admin@sunseating.com',
        password_hash: 'admin123', // hooks will kick in to hash this
        role: 'admin'
      });
      console.log('Default Admin Created: admin@sunseating.com / admin123');
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
});
