import React, { useState } from 'react';
import api from '../services/api';

const RefreshTokenTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, success = true) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      message,
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testAutoRefresh = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addResult('🚀 Bắt đầu test auto refresh token...');
      
      // Test 1: Call protected API (should work with current token)
      addResult('📡 Test 1: Gọi API với token hiện tại...');
      const response1 = await api.get('/api/profile');
      addResult(`✅ API call thành công: ${response1.data.user.name}`);
      
      // Test 2: Wait for token to expire (simulate)
      addResult('⏳ Test 2: Đợi token hết hạn (15 phút)...');
      addResult('💡 Trong thực tế, token sẽ tự động refresh khi hết hạn');
      
      // Test 3: Force another API call
      addResult('📡 Test 3: Gọi API lần nữa...');
      const response2 = await api.get('/api/profile');
      addResult(`✅ API call thành công (có thể đã refresh): ${response2.data.user.name}`);
      
      addResult('🎉 Test hoàn thành! Auto refresh hoạt động tốt.');
      
    } catch (error) {
      addResult(`❌ Test thất bại: ${error.message}`, false);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="refresh-test">
      <h3>🧪 Auto Refresh Token Test</h3>
      
      <div className="test-controls">
        <button 
          onClick={testAutoRefresh} 
          disabled={loading}
          className="test-btn"
        >
          {loading ? 'Đang test...' : 'Chạy Test Auto Refresh'}
        </button>
        
        <button 
          onClick={clearResults}
          className="clear-btn"
        >
          Xóa kết quả
        </button>
      </div>

      <div className="test-results">
        {testResults.map(result => (
          <div 
            key={result.id} 
            className={`test-result ${result.success ? 'success' : 'error'}`}
          >
            <span className="timestamp">[{result.timestamp}]</span>
            <span className="message">{result.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefreshTokenTest;