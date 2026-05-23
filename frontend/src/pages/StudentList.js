import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StudentList() {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const fetchStudents = () => {
    axios.get('http://127.0.0.1:8000/students/')
      .then(res => setStudents(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = (docno) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      axios.delete(`http://127.0.0.1:8000/students/${docno}`)
        .then(() => {
          alert('Student deleted successfully!');
          fetchStudents();
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Master</h2>
      <button onClick={() => navigate('/add-student')}
        style={{ marginBottom: '20px', padding: '10px 20px',
                 backgroundColor: '#4CAF50', color: 'white',
                 border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        + Add Student
      </button>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Doc No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Mobile</th>
            <th>Admission Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.STD_DOCNO}>
              <td>{student.STD_DOCNO}</td>
              <td>{student.STD_STUDENTNAME}</td>
              <td>{student.STD_CLASS}</td>
              <td>{student.STD_SECTION}</td>
              <td>{student.STD_MOBILE}</td>
              <td>{student.STD_ADMISSIONDATE}</td>
              <td>
                <button
                  onClick={() => navigate(`/edit-student/${student.STD_DOCNO}`)}
                  style={{ padding: '5px 10px', backgroundColor: '#2196F3',
                           color: 'white', border: 'none', borderRadius: '3px',
                           cursor: 'pointer', marginRight: '5px' }}>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.STD_DOCNO)}
                  style={{ padding: '5px 10px', backgroundColor: '#f44336',
                           color: 'white', border: 'none', borderRadius: '3px',
                           cursor: 'pointer' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentList;