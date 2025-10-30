import React, { useState } from 'react';
import axios from 'axios';

const UploadAvatar = ({ onBack, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setMessage('❌ Vui lòng chọn file ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/upload-avatar', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessage('✅ ' + response.data.message);
      setTimeout(() => onSuccess(), 2000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Upload thất bại'));
    } finally {
      setLoading(false);
    }
  };

  const handleUrlUpload = async () => {
    if (!avatarUrl) {
      setMessage('❌ Vui lòng nhập URL ảnh');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/api/avatar-url', {
        avatarUrl
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setMessage('✅ ' + response.data.message);
      setTimeout(() => onSuccess(), 2000);
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Cập nhật thất bại'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button onClick={onBack} className="btn btn-secondary back-btn">
          ← Quay lại
        </button>
        <h1>🖼️ Upload Avatar</h1>
        <p>Chọn ảnh đại diện mới</p>
      </div>
      
      <div className="form-container">
        <div className="upload-tabs">
          <button 
            onClick={() => setUploadMethod('file')}
            className={`tab ${uploadMethod === 'file' ? 'active' : ''}`}
          >
            📁 Upload File
          </button>
          <button 
            onClick={() => setUploadMethod('url')}
            className={`tab ${uploadMethod === 'url' ? 'active' : ''}`}
          >
            🔗 Từ URL
          </button>
        </div>

        {uploadMethod === 'file' ? (
          <div className="upload-section">
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
                id="avatar-file"
              />
              <label htmlFor="avatar-file" className="file-label">
                📷 Chọn ảnh từ máy tính
              </label>
            </div>
            
            {preview && (
              <div className="preview-section">
                <h3>👀 Preview:</h3>
                <div className="avatar-preview">
                  <img src={preview} alt="Preview" />
                </div>
              </div>
            )}
            
            <button 
              onClick={handleFileUpload}
              disabled={loading || !selectedFile}
              className="btn btn-primary"
            >
              {loading ? '⏳ Đang upload...' : '📤 Upload Avatar'}
            </button>
          </div>
        ) : (
          <div className="url-section">
            <div className="form-group">
              <label>🔗 URL ảnh:</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="form-input"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            {avatarUrl && (
              <div className="preview-section">
                <h3>👀 Preview:</h3>
                <div className="avatar-preview">
                  <img src={avatarUrl} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              </div>
            )}
            
            <button 
              onClick={handleUrlUpload}
              disabled={loading || !avatarUrl}
              className="btn btn-primary"
            >
              {loading ? '⏳ Đang cập nhật...' : '🔄 Cập nhật Avatar'}
            </button>
          </div>
        )}
        
        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAvatar;