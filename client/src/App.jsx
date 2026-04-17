import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import InventoryList from './pages/Admin/InventoryList';
import AttendanceReport from './pages/Admin/AttendanceReport';
import EmployeeList from './pages/Admin/EmployeeList';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // redirect to their respective dashboard
    return <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace />;
  }

  return <Layout>{children}</Layout>;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/app'} replace /> : <Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/employees" element={<ProtectedRoute requiredRole="admin"><EmployeeList /></ProtectedRoute>} />
      <Route path="/admin/inventory" element={<ProtectedRoute requiredRole="admin"><InventoryList /></ProtectedRoute>} />
      <Route path="/admin/attendance" element={<ProtectedRoute requiredRole="admin"><AttendanceReport /></ProtectedRoute>} />

      {/* Employee Routes */}
      <Route path="/app" element={<ProtectedRoute requiredRole="employee"><EmployeeDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
