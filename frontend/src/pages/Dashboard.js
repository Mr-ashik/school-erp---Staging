import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    total_students: 0,
    total_staff: 0,
    fees_collected: 0,
    today_attendance: 0
  });


  useEffect(() => {
    axios.get('http://127.0.0.1:8000/dashboard/')
      .then(res => {
        console.log(res.data);
        setData(res.data);
      })
      .catch(err => console.error(err));
  }, []);


  const cards = [
   { title: 'Total Students', value: data.total_students, 
      color: '#4CAF50', icon: '🎓', path: '/students' },
    { title: 'Total Staff', value: data.total_staff, 
      color: '#2196F3', icon: '👨‍🏫', path: '/staff' },
    { title: 'Fees Collected (This Month)', value: `AED ${data.fees_collected}`, 
      color: '#FF9800', icon: '💰', path: '/fees' },
    { title: "Today's Attendance", value: data.today_attendance, 
      color: '#9C27B0', icon: '📅', path: '/attendance' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>

      {/* 4 Cards */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {cards.map((card, index) => (
          <div key={index}
            onClick={() => navigate(card.path)}
            style={{
              backgroundColor: card.color,
              color: 'white',
              padding: '30px',
              borderRadius: '10px',
              minWidth: '200px',
              flex: '1',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}>
            <div style={{ fontSize: '40px' }}>{card.icon}</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '16px' }}>{card.title}</div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/students')}
          style={{ padding: '10px 20px', backgroundColor: '#4CAF50',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer' }}>
          🎓 Students
        </button>
        <button onClick={() => navigate('/staff')}
          style={{ padding: '10px 20px', backgroundColor: '#2196F3',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer' }}>
          👨‍🏫 Staff
        </button>
        <button onClick={() => navigate('/fees')}
          style={{ padding: '10px 20px', backgroundColor: '#FF9800',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer' }}>
          💰 Fees
        </button>
        <button onClick={() => navigate('/attendance')}
          style={{ padding: '10px 20px', backgroundColor: '#9C27B0',
                   color: 'white', border: 'none', borderRadius: '5px',
                   cursor: 'pointer' }}>
          📅 Attendance
        </button>
        <button onClick={() => navigate('/attendance-report')}
          style={{ padding: '10px 20px', backgroundColor: '#607D8B',
           color: 'white', border: 'none', borderRadius: '5px',
           cursor: 'pointer' }}>
          📋 Attendance Report
        </button>
      </div>
    </div>
  );
}

export default Dashboard;