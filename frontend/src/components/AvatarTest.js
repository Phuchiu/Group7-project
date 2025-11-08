import React, { useState } from 'react';

const AvatarTest = () => {
  const [testUrl, setTestUrl] = useState('');
  const [imageStatus, setImageStatus] = useState('');

  const testUrls = [
    'http://localhost:3000/uploads/avatar_6902da5fa3c9062f33a04a36_1762613369141.jpg',
    '/uploads/avatar_6902da5fa3c9062f33a04a36_1762613369141.jpg',
    'avatar_6902da5fa3c9062f33a04a36_1762613369141.jpg'
  ];

  const testImage = (url) => {
    setTestUrl(url);
    setImageStatus('Testing...');
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '10px' }}>
      <h3>🧪 Avatar URL Test</h3>
      
      <div>
        <h4>Test URLs:</h4>
        {testUrls.map((url, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <button onClick={() => testImage(url)}>Test URL {index + 1}</button>
            <span style={{ marginLeft: '10px', fontSize: '12px' }}>{url}</span>
          </div>
        ))}
      </div>

      {testUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Testing URL: {testUrl}</h4>
          <p>Status: {imageStatus}</p>
          <img 
            src={testUrl}
            alt="Test Avatar"
            style={{ 
              width: '150px', 
              height: '150px', 
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
            onLoad={() => {
              setImageStatus('✅ Loaded successfully');
              console.log('Image loaded:', testUrl);
            }}
            onError={(e) => {
              setImageStatus('❌ Failed to load');
              console.error('Image failed:', testUrl, e);
            }}
          />
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Check browser console for detailed logs</p>
        <p>Check Network tab to see if requests are being made</p>
      </div>
    </div>
  );
};

export default AvatarTest;