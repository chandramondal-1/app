import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileSpreadsheet, Mail } from 'lucide-react';
import * as XLSX from 'xlsx';
import { API_BASE_URL } from '../../api/config';

const AttendanceReport = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailing, setEmailing] = useState(false);
  const [emailLink, setEmailLink] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/attendance/all`);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    // Format logs into JSON array for Excel transformation
    const formatData = logs.map(log => {
      return {
        'Employee Name': log.user?.name || 'Unknown',
        'Date': log.date,
        'Check In': log.check_in_time ? new Date(log.check_in_time).toLocaleTimeString() : '-',
        'Check Out': log.check_out_time ? new Date(log.check_out_time).toLocaleTimeString() : '-',
        'Working Hours': log.total_hours ? `${log.total_hours}h` : '-',
        'Status': log.status.toUpperCase()
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Details");
    
    // Trigger download
    XLSX.writeFile(workbook, "SunSeating_Attendance_Report.xlsx");
  };

  const sendEmail = async () => {
    setEmailing(true);
    setEmailLink(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/attendance/email-report`, {
        email: 'admin@sunseating.com'
      });
      setEmailLink(response.data.previewUrl);
      alert('Email sent successfully via test server! Check the link below the buttons.');
    } catch (error) {
      alert('Error sending email');
    }
    setEmailing(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
        <h2>Employee Attendance Report</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={sendEmail} disabled={emailing}>
            <Mail size={18} /> {emailing ? 'Sending...' : 'Email Excel Report'}
          </button>
          <button className="btn btn-outline" style={{ color: '#0d6f3f', borderColor: '#0d6f3f' }} onClick={exportExcel}>
            <FileSpreadsheet size={18} /> Download Excel
          </button>
        </div>
      </div>
      
      {emailLink && (
        <div style={{ marginBottom: '1rem', padding: '10px', background: '#e0f7fa', borderRadius: '8px', border: '1px solid #00acc1' }}>
          <strong>📧 Email Sent! (Ethereal Free Server)</strong>
          <br/> View the sent email and Excel attachment live here: <a href={emailLink} target="_blank" rel="noreferrer" style={{color: '#0288d1'}}>{emailLink}</a>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.user?.name}</td>
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
            {logs.length === 0 && <tr><td colSpan="6" className="text-center text-muted">No attendance logs available.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceReport;
