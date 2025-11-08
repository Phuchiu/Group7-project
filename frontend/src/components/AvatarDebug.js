import React, { useState } from 'react';
import api from '../services/api';

const AvatarDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [testImage, setTestImage] = useState('');

  const testAvatarSystem = async () => {
    try {
      const response = await api.get('/api/avatar/test');
      setDebugInfo(response.data);
    } catch (error) {
      setDebugInfo({ error: error.message });
    }
  };

  const testImageUrl = (filename) => {
    setTestImage(`http://localhost:3000/uploads/${filename}`);
  };

  return (
    <div className="avatar-debug">
      <h3>🔧 Avatar Debug Tool</h3>
      
      <button onClick={testAvatarSystem}>Test Avatar System</button>
      
      {debugInfo && (
        <div className="debug-info">
          <h4>Debug Info:</h4>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          
          {debugInfo.files && debugInfo.files.length > 0 && (
            <div>
              <h4>Available Files:</h4>
              {debugInfo.files.map(file => (
                <div key={file} style={{ margin: '10px 0' }}>
                  <span>{file}</span>
                  <button onClick={() => testImageUrl(file)}>Test Image</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {testImage && (
        <div className="test-image">
          <h4>Test Image:</h4>
          <p>URL: {testImage}</p>
          <img 
            src={testImage} 
            alt="Test" 
            style={{ maxWidth: '200px', maxHeight: '200px' }}
            onLoad={() => console.log('Image loaded successfully')}
            onError={(e) => console.error('Image failed to load:', e.target.src)}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarDebug;