const express = require('express');
const router = express.Router();
const { Attendance, User } = require('../models');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');
const XLSX = require('xlsx');
const { sendExcelEmail } = require('../utils/emailService');

function getLocalDateStr() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Employee: Check In
router.post('/check-in', authMiddleware, async (req, res) => {
  try {
    const todayStr = getLocalDateStr();
    
    // Check if already checked in today
    let record = await Attendance.findOne({
      where: {
        user_id: req.user.id,
        date: todayStr
      }
    });

    if (record) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    const checkInTime = new Date();
    // Simple logic for late check-in (e.g., after 9:30 AM local)
    // For universal simplicity, we will leave status defaults but allow passing via body or a fixed time compare
    
    record = await Attendance.create({
      user_id: req.user.id,
      date: todayStr,
      check_in_time: checkInTime,
      status: 'present' 
    });

    res.json({ message: 'Checked in successfully', record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Employee: Check Out
router.post('/check-out', authMiddleware, async (req, res) => {
  try {
    const todayStr = getLocalDateStr();
    
    // Find today's record
    let record = await Attendance.findOne({
      where: {
        user_id: req.user.id,
        date: todayStr
      }
    });

    if (!record) {
      return res.status(400).json({ error: 'Must check in first' });
    }
    if (record.check_out_time) {
      return res.status(400).json({ error: 'Already checked out today' });
    }

    const checkOutTime = new Date();
    const diffMs = checkOutTime - new Date(record.check_in_time);
    const totalHours = (diffMs / (1000 * 60 * 60)).toFixed(2);

    record.check_out_time = checkOutTime;
    record.total_hours = parseFloat(totalHours);
    await record.save();

    res.json({ message: 'Checked out successfully', record });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Employee: My Attendance History
router.get('/my-history', authMiddleware, async (req, res) => {
  try {
    const logs = await Attendance.findAll({
      where: { user_id: req.user.id },
      order: [['date', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all attendance logs for reporting
router.get('/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const logs = await Attendance.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['date', 'DESC']]
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Today's Status (Employee)
router.get('/today', authMiddleware, async (req, res) => {
  try {
    const todayStr = getLocalDateStr();
    const record = await Attendance.findOne({
      where: { user_id: req.user.id, date: todayStr }
    });
    res.json(record); // can be null
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Email Attendance Report (Excel)
router.post('/email-report', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const logs = await Attendance.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['date', 'DESC']]
    });

    const formatData = logs.map(log => ({
      'Employee Name': log.user?.name || 'Unknown',
      'Date': log.date,
      'Check In': log.check_in_time ? new Date(log.check_in_time).toLocaleTimeString() : '-',
      'Check Out': log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString() : '-',
      'Working Hours': log.total_hours ? `${log.total_hours}h` : '-',
      'Status': log.status.toUpperCase()
    }));

    const worksheet = XLSX.utils.json_to_sheet(formatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Details");
    
    // Convert to buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Send email via free dev server
    const emailTo = req.body.email || 'admin@sunseating.com';
    const previewUrl = await sendExcelEmail(buffer, "SunSeating_Attendance.xlsx", emailTo);

    res.json({ message: 'Email sent successfully via test server!', previewUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate and send email.' });
  }
});

module.exports = router;
