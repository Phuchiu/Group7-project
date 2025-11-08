import React, { useState } from 'react';
import api from '../services/api';

const RateLimitDemo = () => {
  const [results, setResults] = useState([]);
  const [testing, setTesting] = useState(false);
  const [testType, setTestType] = useState('login');

  const addResult = (message, success = true, statusCode = 200) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      message,
      success,
      statusCode,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testLoginRateLimit = async () => {
    setTesting(true);
    setResults([]);
    
    addResult('🚀 Bắt đầu test Login Rate Limit (5 attempts/15 phút)...');
    
    for (let i = 1; i <= 7; i++) {
      try {
        addResult(`📡 Attempt ${i}: Trying to login with wrong password...`);
        
        const response = await api.post('/api/auth/login', {
          email: 'admin@example.com',
          password: 'wrongpassword'
        });
        
        addResult(`✅ Attempt ${i}: Unexpected success`, true, response.status);
        
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        if (status === 429) {
          addResult(`🚫 Attempt ${i}: RATE LIMITED! ${message}`, false, status);
          addResult('🎉 Rate limiting working correctly!', true);
          break;
        } else if (status === 400) {
          addResult(`❌ Attempt ${i}: Login failed (expected)`, true, status);
        } else {
          addResult(`⚠️ Attempt ${i}: ${message}`, false, status);
        }
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
  };

  const testUploadRateLimit = async () => {
    setTesting(true);
    setResults([]);
    
    addResult('🚀 Bắt đầu test Upload Rate Limit (3 attempts/phút)...');
    
    // Create a dummy file
    const dummyFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    
    for (let i = 1; i <= 5; i++) {
      try {
        addResult(`📤 Attempt ${i}: Trying to upload avatar...`);
        
        const formData = new FormData();
        formData.append('avatar', dummyFile);
        
        const response = await api.post('/api/avatar/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        addResult(`✅ Attempt ${i}: Upload success`, true, response.status);
        
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        if (status === 429) {
          addResult(`🚫 Attempt ${i}: RATE LIMITED! ${message}`, false, status);
          addResult('🎉 Upload rate limiting working correctly!', true);
          break;
        } else if (status === 401) {
          addResult(`🔐 Attempt ${i}: Need to login first`, false, status);
          break;
        } else {
          addResult(`⚠️ Attempt ${i}: ${message}`, false, status);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setTesting(false);
  };

  const testGeneralRateLimit = async () => {
    setTesting(true);
    setResults([]);
    
    addResult('🚀 Bắt đầu test General API Rate Limit (100 requests/15 phút)...');
    addResult('⚡ Sending 10 rapid requests to test...');
    
    const promises = [];
    for (let i = 1; i <= 10; i++) {
      promises.push(
        api.get('/api/rbac/all-roles').catch(error => ({
          error: true,
          status: error.response?.status,
          message: error.response?.data?.message || error.message,
          attempt: i
        }))
      );
    }
    
    try {
      const results = await Promise.all(promises);
      
      let successCount = 0;
      let rateLimitCount = 0;
      
      results.forEach((result, index) => {
        if (result.error) {
          if (result.status === 429) {
            rateLimitCount++;
            addResult(`🚫 Request ${index + 1}: Rate limited`, false, 429);
          } else {
            addResult(`❌ Request ${index + 1}: ${result.message}`, false, result.status);
          }
        } else {
          successCount++;
          addResult(`✅ Request ${index + 1}: Success`, true, 200);
        }
      });
      
      addResult(`📊 Summary: ${successCount} success, ${rateLimitCount} rate limited`);
      
    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`, false);
    }
    
    setTesting(false);
  };

  const runTest = () => {
    switch (testType) {
      case 'login':
        testLoginRateLimit();
        break;
      case 'upload':
        testUploadRateLimit();
        break;
      case 'general':
        testGeneralRateLimit();
        break;
      default:
        break;
    }
  };

  return (
    <div className="rate-limit-demo">
      <h3>🛡️ Rate Limit Testing</h3>
      
      <div className="test-controls">
        <select 
          value={testType} 
          onChange={(e) => setTestType(e.target.value)}
          disabled={testing}
        >
          <option value="login">Login Rate Limit (5/15min)</option>
          <option value="upload">Upload Rate Limit (3/min)</option>
          <option value="general">General API Limit (100/15min)</option>
        </select>
        
        <button 
          onClick={runTest} 
          disabled={testing}
          className="test-btn"
        >
          {testing ? 'Testing...' : 'Run Test'}
        </button>
        
        <button 
          onClick={clearResults}
          className="clear-btn"
        >
          Clear Results
        </button>
      </div>

      <div className="test-info">
        <h4>ℹ️ Rate Limits:</h4>
        <ul>
          <li><strong>Login:</strong> 5 failed attempts per 15 minutes</li>
          <li><strong>Upload:</strong> 3 uploads per minute</li>
          <li><strong>Password Reset:</strong> 3 attempts per hour</li>
          <li><strong>General API:</strong> 100 requests per 15 minutes</li>
        </ul>
      </div>

      <div className="test-results">
        {results.map(result => (
          <div 
            key={result.id} 
            className={`test-result ${result.success ? 'success' : 'error'}`}
          >
            <span className="timestamp">[{result.timestamp}]</span>
            <span className="status-code">[{result.statusCode}]</span>
            <span className="message">{result.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateLimitDemo;