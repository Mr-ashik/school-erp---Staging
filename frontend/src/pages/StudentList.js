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
      axios.delete(`http://127.0.0.1:8000/students/${docno}`,
        {
          data: {
            USER_ID: localStorage.getItem("USER_ID"),
            MACHINE_ID: window.location.host
          }
        })
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
      <button onClick={() => navigate('/')}
        style={{ marginBottom: '20px', marginRight: '10px',
           padding: '10px 20px', 
           backgroundColor: '#607D8B', color: 'white', 
           border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        🏠 Dashboard
      </button>
      <button onClick={() => navigate('/add-student')}
        style={{ marginBottom: '20px', padding: '10px 20px',
                 backgroundColor: '#4CAF50', color: 'white',
                 border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        + Add Student
      </button>
    {students.length > 0 && (
  <table border="1" cellPadding="10" 
    style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead style={{ backgroundColor: '#f2f2f2' }}>
  <tr>
    {Object.keys(students[0])
      .filter(key => !key.endsWith('_HIDDEN'))
      .map(key => (
        <th key={key}>{key}</th>
    ))}
    <th>Actions</th>
  </tr>
</thead>
    <tbody>
  {students.map(student => (
    <tr key={student.STD_DOCNO_HIDDEN}>
      {Object.entries(student)
        .filter(([key]) => !key.endsWith('_HIDDEN'))
        .map(([key, value], index) => (
          <td key={index}>{value}</td>
      ))}
      <td>
        <button
          onClick={() => navigate(`/edit-student/${student.STD_DOCNO_HIDDEN}`)}
          style={{ padding: '5px 10px', backgroundColor: '#2196F3',
                   color: 'white', border: 'none', borderRadius: '3px',
                   cursor: 'pointer', marginRight: '5px' }}>
          Edit
        </button>
        <button
          onClick={() => handleDelete(student.STD_DOCNO_HIDDEN)}
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
)}
    </div>
  );
}

export default StudentList;