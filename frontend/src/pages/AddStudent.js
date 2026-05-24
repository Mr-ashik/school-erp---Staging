import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddStudent() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({
    STD_STUDENTNAME: '',
    STD_CLASS: '',
    STD_SECTION: '',
    STD_MOBILE: '',
    STD_ADMISSIONDATE: '',
    STD_CLS_DOCNO: '',
    STD_SEC_DOCNO: ''
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/students/', formData)
      .then(res => {
        alert('Student added successfully! Doc No: ' + res.data.STD_DOCNO);
        navigate('/students');
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Student Name</label><br />
          <input name="STD_STUDENTNAME" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Class</label><br />
          <select name="STD_CLS_DOCNO" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required>
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c.CLS_DOCNO} value={c.CLS_DOCNO}>{c.CLS_NAME}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Section</label><br />
          <select name="STD_SEC_DOCNO" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required>
            <option value="">Select Section</option>
            {sections.map(s => (
              <option key={s.SEC_DOCNO} value={s.SEC_DOCNO}>{s.SEC_NAME}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mobile</label><br />
          <input name="STD_MOBILE" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Admission Date</label><br />
          <input type="date" name="STD_ADMISSIONDATE" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <button type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer', marginRight: '10px' }}>
          Save Student
        </button>
        <button type="button" onClick={() => navigate('/students')}
          style={{ padding: '10px 20px', backgroundColor: '#f44336',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer' }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddStudent;