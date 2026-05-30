import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SystemUtilities() {
  const navigate = useNavigate();
  const [lastNoData, setLastNoData] = useState([]);
  const [syncing, setSyncing] = useState(null);

  const fetchLastNoStatus = () => {
    axios.get('http://127.0.0.1:8000/lastno-status/')
      .then(res => setLastNoData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLastNoStatus();
  }, []);

 const handleSync = (item) => {
    if (!item.LNO_TABLE) {
      alert(`No table config found for ${item.LNO_DOCTYPE}!`);
      return;
    }
    setSyncing(item.LNO_DOCTYPE);
    axios.post('http://127.0.0.1:8000/sync-lastno/', {
      DOCTYPE: item.LNO_DOCTYPE
    })
    .then(() => {
      fetchLastNoStatus();
      setSyncing(null);
    })
    .catch(err => {
      console.error(err);
      setSyncing(null);
    });
  };

  const buildDocNo = (item) => {
    const prefix = item.LNO_PREFIX || '';
    const suffix = item.LNO_SUFFIX || '';
    const no     = String(item.LNO_CURRENT_NO).padStart(4, '0');
    return `${prefix}${no}${suffix}`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>System Utilities</h2>
      <button onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '10px 20px',
                 backgroundColor: '#607D8B', color: 'white',
                 border: 'none', borderRadius: '5px',
                 cursor: 'pointer' }}>
        🏠 Dashboard
      </button>

      <h3>Last Number Status</h3>
      <p style={{ color: '#666' }}>
        Current document numbers in the system. 
        Click Update to sync with actual table data.
      </p>

      <table border="1" cellPadding="10"
        style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f2f2f2' }}>
          <tr>
            <th>Module</th>
            <th>DOCTYPE</th>
            <th>Last DocNo</th>
            <th>Table</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {lastNoData.map(item => (
            <tr key={item.LNO_DOCTYPE}>
              <td>{item.LSC_LABEL || '-'}</td>
              <td>{item.LNO_DOCTYPE}</td>
              <td>
                <span style={{ fontWeight: 'bold', color: '#2196F3' }}>
                  {buildDocNo(item)}
                </span>
              </td>
              <td>{item.LNO_TABLE  || '-'}</td>
              <td>
                {item.LNO_TABLE  ? (
                  <button
                    onClick={() => handleSync(item)}
                    disabled={syncing === item.LNO_DOCTYPE}
                    style={{ padding: '5px 15px',
                             backgroundColor: syncing === item.LNO_DOCTYPE
                               ? '#ccc' : '#4CAF50',
                             color: 'white', border: 'none',
                             borderRadius: '3px', cursor: 'pointer' }}>
                    {syncing === item.LNO_DOCTYPE ? '...' : '🔄 Update'}
                  </button>
                ) : (
                  <span style={{ color: '#999' }}>No Config</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SystemUtilities;