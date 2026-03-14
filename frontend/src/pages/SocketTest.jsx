import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketTest = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      setConnected(true);
      addLog('✅ Connected to Socket.io server');
      addLog(`Socket ID: ${newSocket.id}`);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      addLog('❌ Disconnected from Socket.io server');
    });

    newSocket.on('connect_error', (error) => {
      setConnected(false);
      addLog(`❌ Connection error: ${error.message}`);
    });

    // Test echo
    newSocket.on('echo_response', (data) => {
      addLog(`📨 Echo response: ${data.message}`);
    });

    // Test notifications
    newSocket.on('freelancer_applied', (data) => {
      addLog(`🔔 New application: ${data.freelancerName} applied for "${data.projectTitle}"`);
    });

    newSocket.on('test_broadcast', (data) => {
      addLog(`📢 Broadcast received: ${data.message}`);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), message }]);
  };

  const testConnection = () => {
    if (socket && connected) {
      addLog('📤 Sending test message...');
      socket.emit('test_message', { message: 'Hello Server!' });
    } else {
      addLog('❌ Not connected to server');
    }
  };

  const testEcho = () => {
    if (socket && connected) {
      addLog('📤 Sending echo message...');
      socket.emit('test_echo', { message: testMessage || 'Echo test!' });
    } else {
      addLog('❌ Not connected to server');
    }
  };

  const testNotification = () => {
    if (socket && connected) {
      const testData = {
        projectId: 'test-' + Date.now(),
        freelancerName: 'Test Freelancer',
        projectTitle: 'Test Project',
        freelancerId: 'freelancer-test'
      };
      
      addLog('📤 Simulating freelancer application...');
      socket.emit('apply_to_project', testData);
    } else {
      addLog('❌ Not connected to server');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Socket.io Connection Test</h2>
      
      <div style={{ 
        padding: '1rem', 
        backgroundColor: connected ? '#d4edda' : '#f8d7da', 
        borderRadius: '4px',
        marginBottom: '1rem'
      }}>
        <strong>Connection Status:</strong> {connected ? '✅ Connected' : '❌ Disconnected'}
        {connected && <span style={{ marginLeft: '1rem' }}>Socket ID: {socket?.id}</span>}
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h3>Test Functions:</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={testConnection} disabled={!connected} 
            style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
            Test Connection
          </button>
          <button onClick={testEcho} disabled={!connected}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
            Test Echo
          </button>
          <button onClick={testNotification} disabled={!connected}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>
            Test Notification
          </button>
          <button onClick={clearLogs}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
            Clear Logs
          </button>
        </div>
        
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Enter echo message"
          style={{ marginTop: '0.5rem', padding: '0.5rem', width: '300px' }}
        />
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        border: '1px solid #dee2e6', 
        borderRadius: '4px',
        height: '300px',
        overflowY: 'auto',
        padding: '1rem'
      }}>
        <h3>Connection Logs:</h3>
        {logs.length === 0 ? (
          <p style={{ color: '#6c757d' }}>No logs yet...</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: '#6c757d' }}>[{log.time}]</span> {log.message}
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#e7f3ff', borderRadius: '4px' }}>
        <h4>How to Test:</h4>
        <ol>
          <li>Make sure backend server is running on port 3000</li>
          <li>Open this test page</li>
          <li>Check if connection status shows "Connected"</li>
          <li>Click test buttons to verify different functions</li>
          <li>Watch logs for real-time responses</li>
        </ol>
      </div>
    </div>
  );
};

export default SocketTest;
