import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Package, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    totalProducts: 0,
    lowStockItems: 0,
    todayStockMovements: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/dashboard/summary`);
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
        <h2>System Overview</h2>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--primary-dark)'}}>
            <Users size={24} />
          </div>
          <div className="stat-right">
            <h4>Total Employees</h4>
            <h2>{stats.totalEmployees}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--success)'}}>
            <Users size={24} />
          </div>
          <div className="stat-right">
            <h4>Present Today</h4>
            <h2>{stats.presentToday}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--danger)'}}>
            <Users size={24} />
          </div>
          <div className="stat-right">
            <h4>Absent Today</h4>
            <h2>{stats.absentToday}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-right">
            <h4>Total Products</h4>
            <h2>{stats.totalProducts}</h2>
          </div>
        </div>

        <div className="stat-card" style={stats.lowStockItems > 0 ? { borderColor: 'var(--danger)' } : {}}>
          <div className="stat-icon" style={{color: 'var(--danger)'}}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-right">
            <h4>Low Stock Alerts</h4>
            <h2 style={stats.lowStockItems > 0 ? { color: 'var(--danger)' } : {}}>{stats.lowStockItems}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{color: 'var(--succes)'}}>
            <ArrowRightLeft size={24} />
          </div>
          <div className="stat-right">
            <h4>Today's Movements</h4>
            <h2>{stats.todayStockMovements}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
