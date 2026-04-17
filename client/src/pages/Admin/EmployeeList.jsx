import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/auth/employees`);
      // filter out admin so only employees show
      setEmployees(data.filter(u => u.role === 'employee'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      setFormData({ name: '', email: '', password: '' });
      setIsModalOpen(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create employee');
    }
  };

  return (
    <div>
      <div className="header">
        <h2>Employee Management</h2>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <UserPlus size={18} /> New Employee
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Date Registered</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id}>
                <td><div style={{fontWeight: 500}}>{emp.name}</div></td>
                <td className="text-muted">{emp.email}</td>
                <td>
                  <span className="badge badge-success">Employee</span>
                </td>
                <td>{new Date(emp.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {employees.length === 0 && <tr><td colSpan="4" className="text-center text-muted">No employees found.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Register New Employee</h3>
            <form onSubmit={handleCreate} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  className="form-control" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Temporary Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  required 
                  minLength="6"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
