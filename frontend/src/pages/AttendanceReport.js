import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AttendanceReport() {
  const navigate = useNavigate();
  const [report, setReport] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [filter, setFilter] = useState({
    cls: '',
    section: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Load classes and sections on page load
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/classes/')
      .then(res => setClasses(res.data))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/sections/')
      .then(res => setSections(res.data))
      .catch(err => console.error(err));
  }, []);

  const loadReport = () => {
    if (!filter.cls || !filter.section) {
      alert('Please select Class and Section!');
      return;
    }
    axios.get(`http://127.0.0.1:8000/attendance/report/?cls=${filter.cls}&section=${filter.section}&att_date=${filter.date}`)
      .then(res => setReport(res.data))
      .catch(err => console.error(err));
  };

  const getStatusColor = (status) => {
    if (status === 'P') return '#4CAF50';
    if (status === 'A') return '#f44336';
    if (status === 'L') return '#FF9800';
    return '#000';
  };

  const getStatusLabel = (status) => {
    if (status === 'P') return 'Present';
    if (status === 'A') return 'Absent';
    if (status === 'L') return 'Late';
    return status;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Attendance Report</h2>

      {/* Filter Section */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label>Date</label><br />
          <input type="date" value={filter.date}
            onChange={e => setFilter({ ...filter, date: e.target.value })}
            style={{ padding: '8px', marginTop: '5px' }} />
        </div>
        <div>
          <label>Class</label><br />
          <select value={filter.cls}
            onChange={e => setFilter({ ...filter, cls: e.target.value })}
            style={{ padding: '8px', marginTop: '5px' }}>
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.CLS_DOCNO} value={c.CLS_DOCNO}>{c.CLS_NAME}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Section</label><br />
          <select value={filter.section}
            onChange={e => setFilter({ ...filter, section: e.target.value })}
            style={{ padding: '8px', marginTop: '5px' }}>
            <option value="">Select Section</option>
            {sections.map(s => (
              <option key={s.SEC_DOCNO} value={s.SEC_DOCNO}>{s.SEC_NAME}</option>
            ))}
          </select>
        </div>
        <div style={{ alignSelf: 'flex-end' }}>
          <button onClick={loadReport}
            style={{ padding: '8px 20px', backgroundColor: '#2196F3',
                     color: 'white', border: 'none', borderRadius: '5px',
                     cursor: 'pointer' }}>
            Load Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {report.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#4CAF50', color: 'white',
                          padding: '15px 25px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {report.filter(r => r.STATUS === 'P').length}
              </div>
              <div>Present</div>
            </div>
            <div style={{ backgroundColor: '#f44336', color: 'white',
                          padding: '15px 25px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {report.filter(r => r.STATUS === 'A').length}
              </div>
              <div>Absent</div>
            </div>
            <div style={{ backgroundColor: '#FF9800', color: 'white',
                          padding: '15px 25px', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {report.filter(r => r.STATUS === 'L').length}
              </div>
              <div>Late</div>
            </div>
          </div>

          {/* Report Table */}
          <table border="1" cellPadding="10"
            style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th>#</th>
                <th>Doc No</th>
                <th>Name</th>
                <th>Session</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {report.map((r, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{r.STD_DOCNO}</td>
                  <td>{r.STD_NAME}</td>
                  <td>{r.SESSION}</td>
                  <td>
                    <span style={{
                      backgroundColor: getStatusColor(r.STATUS),
                      color: 'white',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '13px'
                    }}>
                      {getStatusLabel(r.STATUS)}
                    </span>
                  </td>
                  <td>{r.REMARKS || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {report.length === 0 && (
        <p style={{ color: '#999' }}>
          No attendance records found. Load report to view.
        </p>
      )}

      <br />
      <button onClick={() => navigate('/')}
        style={{ padding: '10px 20px', backgroundColor: '#607D8B',
                 color: 'white', border: 'none', borderRadius: '5px',
                 cursor: 'pointer' }}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default AttendanceReport;