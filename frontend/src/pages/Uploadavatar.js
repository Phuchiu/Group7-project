// src/pages/Uploadavatar.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Uploadavatar.css';

function Uploadavatar() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file tối đa 5MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Vui lòng chọn ảnh');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      const response = await axios.post(
        `${API_URL}/auth/upload-avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update user in localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.avatar = response.data.avatar;
      localStorage.setItem('user', JSON.stringify(user));

      alert('Cập nhật ảnh đại diện thành công!');
      navigate('/profile');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>📷 Cập nhật ảnh đại diện</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="upload-area">
          {preview ? (
            <div className="preview">
              <img src={preview} alt="Preview" />
            </div>
          ) : (
            <div className="placeholder">
              <p>👤</p>
              <p>Chưa chọn ảnh</p>
            </div>
          )}
        </div>

        <div className="upload-actions">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="file-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="btn-choose">
            📁 Chọn ảnh
          </label>

          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="btn-upload"
          >
            {loading ? 'Đang upload...' : '✅ Upload'}
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="btn-cancel"
          >
            ❌ Hủy
          </button>
        </div>

        <p className="upload-note">
          * Chỉ chấp nhận file ảnh (JPG, PNG, GIF)<br />
          * Kích thước tối đa: 5MB
        </p>
      </div>
    </div>
  );
}

export default Uploadavatar;