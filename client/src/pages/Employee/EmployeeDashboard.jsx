import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogIn, LogOut, Activity } from 'lucide-react';
import { API_BASE_URL } from '../../api/config';

const EmployeeDashboard = () => {
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [todayRes, historyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/attendance/today`),
        axios.get(`${API_BASE_URL}/api/attendance/my-history`)
      ]);
      setTodayRecord(todayRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCheckIn = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/attendance/check-in`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error checking in');
    }
  };

  const handleCheckOut = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/attendance/check-out`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Error checking out');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
        <h2>My Attendance Hub</h2>
      </div>

      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', padding: '3rem 2rem' }}>
        <h3>Today's Status</h3>
        
        {!todayRecord ? (
          <div>
            <p className="text-muted" style={{margin: '1rem'}}>You have not checked in yet today.</p>
            <button className="btn btn-primary" onClick={handleCheckIn}>
              <LogIn size={20}/> Check In Now
            </button>
          </div>
        ) : !todayRecord.check_out_time ? (
          <div>
            <p className="text-muted" style={{margin: '1rem'}}>
              Checked in at: {new Date(todayRecord.check_in_time).toLocaleTimeString()}
            </p>
            <button className="btn btn-danger" onClick={handleCheckOut}>
              <LogOut size={20}/> Check Out
            </button>
          </div>
        ) : (
          <div>
            <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              <Activity size={40} />
            </div>
            <h4>Shift Completed!</h4>
            <p className="text-muted">Total Hours: {todayRecord.total_hours}</p>
          </div>
        )}
      </div>

      <h3>Recent History</h3>
      <div className="table-container" style={{ marginTop: '1rem' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(log => (
              <tr key={log.id}>
                <td>{log.date}</td>
                <td>{log.check_in_time ? new Date(log.check_in_time).toLocaleTimeString() : '-'}</td>
                <td>{log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString() : '-'}</td>
                <td>{log.total_hours ? `${log.total_hours}h` : '-'}</td>
                <td>
                  <span className={`badge ${log.status === 'present' ? 'badge-success' : 'badge-danger'}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr><td colSpan="5" className="text-center">No attendance logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
