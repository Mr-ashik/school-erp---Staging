import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditStudent() {
  const { docno } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    STD_STUDENTNAME: '',
    STD_CLASS: '',
    STD_SECTION: '',
    STD_MOBILE: '',
    STD_ADMISSIONDATE: ''
  });

  // Load existing student data
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/students/${docno}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error(err));
  }, [docno]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://127.0.0.1:8000/students/${docno}`, formData)
      .then(() => {
        alert('Student updated successfully!');
        navigate('/');
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Edit Student — {docno}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Student Name</label><br />
          <input name="STD_STUDENTNAME"
            value={formData.STD_STUDENTNAME}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Class</label><br />
          <input name="STD_CLASS"
            value={formData.STD_CLASS}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Section</label><br />
          <input name="STD_SECTION"
            value={formData.STD_SECTION}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Mobile</label><br />
          <input name="STD_MOBILE"
            value={formData.STD_MOBILE}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Admission Date</label><br />
          <input type="date" name="STD_ADMISSIONDATE"
            value={formData.STD_ADMISSIONDATE}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required />
        </div>
        <button type="submit"
          style={{ padding: '10px 20px', backgroundColor: '#2196F3',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer', marginRight: '10px' }}>
          Update Student
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

export default EditStudent;