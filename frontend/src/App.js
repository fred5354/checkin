import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Function to check if running locally
const isLocalEnvironment = () => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || 
         hostname === '127.0.0.1' || 
         hostname === '::1' ||
         hostname.includes('.local');
};

// Auto-detect environment
const ENV = isLocalEnvironment() ? 'development' : 'production';
const API_URL = ENV === 'development' 
  ? 'http://localhost:3000' 
  : process.env.REACT_APP_PROD_API_URL;

console.log(`Running in ${ENV} environment (Auto-detected)`);
console.log(`API URL: ${API_URL}`);

function App() {
  const [name, setName] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState(null);
  const [envInfo, setEnvInfo] = useState(null);

  useEffect(() => {
    fetchVolunteers();
    fetchEnvironmentInfo();
  }, []);

  const fetchEnvironmentInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/environment`);
      setEnvInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch environment info:', error);
    }
  };

  const fetchVolunteers = async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/api/volunteers`);
      setVolunteers(response.data);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
      setError('Failed to load volunteers. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      await axios.post(`${API_URL}/api/volunteers`, { name });
      setName('');
      fetchVolunteers();
    } catch (error) {
      console.error('Failed to save:', error);
      setError('Failed to save volunteer. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>
        Volunteer Registration 
        <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>
          ({ENV})
        </span>
      </h1>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{ padding: '8px', fontSize: '16px', width: '200px' }}
        />
        <button 
          type="submit"
          style={{ 
            marginLeft: '10px',
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: ENV === 'development' ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </form>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {envInfo && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '0.9em'
        }}>
          <h3>Environment Info:</h3>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(envInfo, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Registered Volunteers</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {volunteers.map(volunteer => (
            <li 
              key={volunteer._id}
              style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                fontSize: '16px'
              }}
            >
              {volunteer.name} - {new Date(volunteer.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;