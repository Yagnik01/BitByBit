import React, { useState } from 'react';
import { io } from 'socket.io-client';

const TestApplication = () => {
  const [socket, setSocket] = useState(null);
  const [projectId, setProjectId] = useState('test-project-123');
  const [freelancerName, setFreelancerName] = useState('John Doe');
  const [projectTitle, setProjectTitle] = useState('Build a Website');
  const [status, setStatus] = useState('');

  React.useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);

    newSocket.on('application_sent', (data) => {
      setStatus(`✅ ${data.message}`);
    });

    newSocket.on('error', (data) => {
      setStatus(`❌ ${data.message}`);
    });

    newSocket.on('project_accepted', (data) => {
      setStatus(`🎉 ${data.message}`);
    });

    newSocket.on('project_rejected', (data) => {
      setStatus(`📄 ${data.message}`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleApply = () => {
    if (socket) {
      const freelancerId = `freelancer-${Date.now()}`;
      
      socket.emit('join_user_room', freelancerId);
      
      socket.emit('apply_to_project', {
        projectId,
        freelancerId,
        freelancerName,
        projectTitle
      });
      
      setStatus('📤 Applying to project...');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Test Freelancer Application</h2>
      <p>This page simulates a freelancer applying to a project. Open this in a separate browser to test real-time notifications.</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Project ID:
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Freelancer Name:
          <input
            type="text"
            value={freelancerName}
            onChange={(e) => setFreelancerName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Project Title:
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
          />
        </label>
      </div>

      <button
        onClick={handleApply}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem'
        }}
      >
        Apply to Project
      </button>

      {status && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '4px'
        }}>
          <strong>Status:</strong> {status}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>How to Test:</h4>
        <ol>
          <li>Open the main application and log in</li>
          <li>Open this test page in a separate tab</li>
          <li>Click "Apply to Project" on this page</li>
          <li>You should see a real-time notification in the main app's navbar</li>
          <li>Click the notification bell to see the application</li>
          <li>Use Confirm/Reject buttons to respond</li>
        </ol>
      </div>
    </div>
  );
};

export default TestApplication;
