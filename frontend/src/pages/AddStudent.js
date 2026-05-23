import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddStudent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    STD_STUDENTNAME: '',
    STD_CLASS: '',
    STD_SECTION: '',
    STD_MOBILE: '',
    STD_ADMISSIONDATE: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/students/', formData)
      .then(res => {
        alert('Student added successfully! Doc No: ' + res.data.STD_DOCNO);
        navigate('/');
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
          <input name="STD_CLASS" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Section</label><br />
          <input name="STD_SECTION" onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
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
        <button type="button" onClick={() => navigate('/')}
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