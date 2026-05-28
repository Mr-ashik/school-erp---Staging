import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MarkAttendance() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [filter, setFilter] = useState({
    cls: '',
    section: '',
    date: new Date().toISOString().split('T')[0],
    ses_docno: ''
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/sessions/')
      .then(res => setSessions(res.data))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/classes/')
      .then(res => setClasses(res.data))
      .catch(err => console.error(err));

    axios.get('http://127.0.0.1:8000/sections/')
      .then(res => setSections(res.data))
      .catch(err => console.error(err));
  }, []);

  const loadStudents = () => {
    if (!filter.cls || !filter.section) {
      alert('Please select Class and Section!');
      return;
    }
    axios.get(`http://127.0.0.1:8000/attendance/students/?cls=${filter.cls}&section=${filter.section}`)
      .then(res => {
        setStudents(res.data);
        const defaultAtt = {};
        res.data.forEach(s => {
          defaultAtt[s.STD_DOCNO_HIDDEN] = { status: 'P', remarks: '' };
        });
        setAttendance(defaultAtt);
      })
      .catch(err => console.error(err));
  };

  const handleStatusChange = (docno, status) => {
    setAttendance(prev => ({
      ...prev,
      [docno]: { ...prev[docno], status }
    }));
  };

  const handleRemarksChange = (docno, remarks) => {
    setAttendance(prev => ({
      ...prev,
      [docno]: { ...prev[docno], remarks }
    }));
  };

  const handleSubmit = () => {
    if (!filter.ses_docno) {
      alert('Please select Session!');
      return;
    }
    if (students.length === 0) {
      alert('Please load students first!');
      return;
    }
    const records = students.map(s => ({
      ATT_STD_DOCNO: s.STD_DOCNO_HIDDEN,
      ATT_STD_NAME: s.STD_STUDENTNAME,
      ATT_CLASS: s.STD_CLASS,
      ATT_SECTION: s.STD_SECTION,
      ATT_STATUS: attendance[s.STD_DOCNO_HIDDEN]?.status || 'P',
      ATT_REMARKS: attendance[s.STD_DOCNO_HIDDEN]?.remarks || ''
    }));

    axios.post('http://127.0.0.1:8000/attendance/', {
      ATT_DATE: filter.date,
      ATT_SES_DOCNO: filter.ses_docno,
      records
    })
      .then(() => {
        alert('Attendance marked successfully!');
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mark Attendance</h2>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div>
          <label>Date</label><br />
          <input type="date" value={filter.date}
            onChange={e => setFilter({ ...filter, date: e.target.value })}
            style={{ padding: '8px', marginTop: '5px' }} />
        </div>
        <div>
          <label>Session</label><br />
          <select value={filter.ses_docno}
            onChange={e => setFilter({ ...filter, ses_docno: e.target.value })}
            style={{ padding: '8px', marginTop: '5px' }}>
            <option value="">Select Session</option>
            {sessions.map(s => (
              <option key={s.SES_DOCNO} value={s.SES_DOCNO}>{s.SES_NAME}</option>
            ))}
          </select>
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
          <button onClick={loadStudents}
            style={{ padding: '8px 20px', backgroundColor: '#2196F3',
                     color: 'white', border: 'none', borderRadius: '5px',
                     cursor: 'pointer' }}>
            Load Students
          </button>
        </div>
      </div>

      {students.length > 0 && (
        <>
          <table border="1" cellPadding="10"
            style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th>#</th>
                <th>Doc No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={s.STD_DOCNO_HIDDEN}>
                  <td>{index + 1}</td>
                  <td>{s.STD_DOCNO_HIDDEN}</td>
                  <td>{s.STD_STUDENTNAME}</td>
                  <td>
                    <select
                      value={attendance[s.STD_DOCNO_HIDDEN]?.status || 'P'}
                      onChange={e => handleStatusChange(s.STD_DOCNO_HIDDEN, e.target.value)}
                      style={{ padding: '5px' }}>
                      <option value="P">Present</option>
                      <option value="A">Absent</option>
                      <option value="L">Late</option>
                    </select>
                  </td>
                  <td>
                    <input
                      value={attendance[s.STD_DOCNO_HIDDEN]?.remarks || ''}
                      onChange={e => handleRemarksChange(s.STD_DOCNO_HIDDEN, e.target.value)}
                      placeholder="Optional"
                      style={{ padding: '5px', width: '150px' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSubmit}
            style={{ padding: '10px 30px', backgroundColor: '#4CAF50',
                     color: 'white', border: 'none', borderRadius: '5px',
                     cursor: 'pointer', marginRight: '10px' }}>
            Save Attendance
          </button>
          <button onClick={() => navigate('/')}
            style={{ padding: '10px 20px', backgroundColor: '#f44336',
                     color: 'white', border: 'none', borderRadius: '5px',
                     cursor: 'pointer' }}>
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

export default MarkAttendance;