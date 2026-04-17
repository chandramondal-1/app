import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Clock, Users, LogOut, Coffee, UserCircle } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Coffee className="stat-icon" style={{width: 30, height: 30, margin: 0}} />
          SunSeating
        </div>

        {user.role === 'admin' ? (
          <>
            <NavLink to="/admin" end className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <LayoutDashboard size={20} /> Dashboard
            </NavLink>
            <NavLink to="/admin/employees" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <UserCircle size={20} /> Employees
            </NavLink>
            <NavLink to="/admin/inventory" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Package size={20} /> Inventory
            </NavLink>
            <NavLink to="/admin/attendance" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Users size={20} /> Attendance
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/app" end className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
              <Clock size={20} /> My Attendance
            </NavLink>
          </>
        )}

        <div style={{ marginTop: 'auto' }}>
          <div className="nav-link" style={{ pointerEvents: 'none', color: 'var(--text-main)' }}>
            <div style={{fontWeight: '600'}}>{user.name}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', marginTop: '1rem', border: 'none', color: 'var(--danger)', justifyContent: 'flex-start' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
