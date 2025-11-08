import React, { useState } from 'react';
import axios from 'axios';

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await axios.post('http://localhost:3000/api/auth/forgot-password', {
        email: testEmail
      });
      setResult(`✅ Success: ${response.data.message}`);
    } catch (error) {
      setError(`❌ Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-test-container">
      <div className="email-test-form">
        <h3>🧪 Test Email Functionality</h3>
        <p>Test forgot password email sending</p>
        
        <form onSubmit={handleTest}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Enter test email address"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Test Email'}
          </button>
        </form>

        {result && <div className="test-result success">{result}</div>}
        {error && <div className="test-result error">{error}</div>}

        <div className="test-instructions">
          <h4>Instructions:</h4>
          <ol>
            <li>Make sure backend server is running</li>
            <li>Configure EMAIL_USER and EMAIL_PASS in .env</li>
            <li>Enter a valid email address</li>
            <li>Click "Send Test Email"</li>
            <li>Check your email inbox</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default EmailTest;