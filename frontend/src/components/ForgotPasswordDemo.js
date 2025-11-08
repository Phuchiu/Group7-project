import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import EmailTest from './EmailTest';

const ForgotPasswordDemo = () => {
  const [currentView, setCurrentView] = useState('demo');
  const [demoToken] = useState('demo-token-123456789');

  const renderDemo = () => (
    <div className="demo-container">
      <div className="demo-header">
        <h1>🔐 Forgot Password & Reset Password Demo</h1>
        <p>Comprehensive demonstration of forgot password functionality</p>
      </div>

      <div className="demo-grid">
        <div className="demo-card">
          <h3>📧 Forgot Password Form</h3>
          <p>User enters email to receive reset link</p>
          <button 
            className="demo-btn"
            onClick={() => setCurrentView('forgot')}
          >
            View Forgot Password Form
          </button>
        </div>

        <div className="demo-card">
          <h3>🔑 Reset Password Form</h3>
          <p>User sets new password using token from email</p>
          <button 
            className="demo-btn"
            onClick={() => setCurrentView('reset')}
          >
            View Reset Password Form
          </button>
        </div>

        <div className="demo-card">
          <h3>🧪 Email Test Tool</h3>
          <p>Test email sending functionality</p>
          <button 
            className="demo-btn"
            onClick={() => setCurrentView('test')}
          >
            Test Email Functionality
          </button>
        </div>
      </div>

      <div className="demo-features">
        <h2>✨ Features Implemented</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h4>🔒 Security</h4>
            <ul>
              <li>32-byte hex token generation</li>
              <li>1-hour token expiration</li>
              <li>One-time use tokens</li>
              <li>Password strength validation</li>
            </ul>
          </div>
          
          <div className="feature-item">
            <h4>📧 Email Integration</h4>
            <ul>
              <li>Gmail SMTP configuration</li>
              <li>HTML email templates</li>
              <li>Professional email design</li>
              <li>Real email delivery</li>
            </ul>
          </div>
          
          <div className="feature-item">
            <h4>🎨 User Experience</h4>
            <ul>
              <li>Responsive design</li>
              <li>Form validation</li>
              <li>Loading states</li>
              <li>Success confirmations</li>
            </ul>
          </div>
          
          <div className="feature-item">
            <h4>⚡ Technical</h4>
            <ul>
              <li>React Router integration</li>
              <li>RESTful API endpoints</li>
              <li>Error handling</li>
              <li>MongoDB integration</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="demo-api">
        <h2>🔌 API Endpoints</h2>
        <div className="api-endpoints">
          <div className="endpoint">
            <span className="method post">POST</span>
            <span className="url">/api/auth/forgot-password</span>
            <span className="description">Send reset password email</span>
          </div>
          <div className="endpoint">
            <span className="method post">POST</span>
            <span className="url">/api/auth/reset-password/:token</span>
            <span className="description">Reset password with token</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="forgot-password-demo">
      {currentView === 'demo' && renderDemo()}
      
      {currentView === 'forgot' && (
        <div>
          <button 
            className="back-to-demo"
            onClick={() => setCurrentView('demo')}
          >
            ← Back to Demo
          </button>
          <ForgotPassword onBack={() => setCurrentView('demo')} />
        </div>
      )}
      
      {currentView === 'reset' && (
        <div>
          <button 
            className="back-to-demo"
            onClick={() => setCurrentView('demo')}
          >
            ← Back to Demo
          </button>
          <div className="demo-note">
            <p><strong>Note:</strong> This is a demo with a sample token. In real usage, the token comes from the email link.</p>
          </div>
          {/* Mock ResetPassword with demo token */}
          <div className="auth-container">
            <div className="auth-form">
              <h2>🔑 Reset Password Demo</h2>
              <p>This demonstrates the reset password form interface.</p>
              <p><strong>Demo Token:</strong> {demoToken}</p>
              <div className="demo-form">
                <div className="form-group">
                  <input type="password" placeholder="New password" />
                </div>
                <div className="form-group">
                  <input type="password" placeholder="Confirm new password" />
                </div>
                <button type="button" className="demo-btn">
                  Reset Password (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {currentView === 'test' && (
        <div>
          <button 
            className="back-to-demo"
            onClick={() => setCurrentView('demo')}
          >
            ← Back to Demo
          </button>
          <EmailTest />
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordDemo;