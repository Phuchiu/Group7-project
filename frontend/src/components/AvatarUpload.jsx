// src/components/Profile/AvatarUpload.jsx
// Hoạt động 3: Upload avatar với preview, resize, Cloudinary

import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import './Avatar.css';

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentAvatar || '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      console.log('🖼️ Preview created');
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn ảnh trước');
      return;
    }

    try {
      setUploading(true);
      setError('');
      console.log('📤 Uploading avatar...', file.name);

      // Create FormData
      const formData = new FormData();
      formData.append('avatar', file);

      // Upload to backend (backend sẽ xử lý Cloudinary)
      const response = await axiosInstance.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log('✅ Upload success:', response.data);

      const { avatarUrl } = response.data;

      // Update preview với URL từ Cloudinary
      setPreview(avatarUrl);

      // Callback để update parent component
      if (onAvatarUpdate) {
        onAvatarUpdate(avatarUrl);
      }

      // Clear file input
      setFile(null);

      alert('Upload avatar thành công!');

    } catch (error) {
      console.error('❌ Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Upload thất bại';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Handle remove/cancel
  const handleCancel = () => {
    setFile(null);
    setPreview(currentAvatar || '');
    setError('');
  };

  return (
    <div className="avatar-upload-container">
      <h3>📸 Upload Avatar</h3>

      {error && (
        <div className="avatar-error">
          ⚠️ {error}
        </div>
      )}

      <div className="avatar-preview-section">
        <div className="avatar-preview">
          {preview ? (
            <img src={preview} alt="Avatar preview" />
          ) : (
            <div className="avatar-placeholder">
              <span>📷</span>
              <p>No Avatar</p>
            </div>
          )}
        </div>

        <div className="avatar-info">
          <p><strong>Current Avatar</strong></p>
          {preview ? (
            <span className="status-badge status-success">✓ Có avatar</span>
          ) : (
            <span className="status-badge status-warning">⚠ Chưa có avatar</span>
          )}
        </div>
      </div>

      <div className="avatar-upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="avatar-input"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="file-input"
          />
          <label htmlFor="avatar-input" className="file-input-label">
            📁 Chọn ảnh
          </label>
          {file && (
            <span className="file-name">
              {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </span>
          )}
        </div>

        <div className="avatar-actions">
          {file ? (
            <>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-upload"
              >
                {uploading ? '⏳ Đang upload...' : '📤 Upload'}
              </button>
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="btn-cancel"
              >
                ❌ Hủy
              </button>
            </>
          ) : (
            <p className="upload-hint">
              ℹ️ Chọn ảnh để xem preview và upload
            </p>
          )}
        </div>
      </div>

      <div className="avatar-guidelines">
        <h4>📋 Hướng dẫn:</h4>
        <ul>
          <li>Chấp nhận: JPG, PNG, GIF, WEBP</li>
          <li>Kích thước tối đa: 5MB</li>
          <li>Khuyến nghị: Ảnh vuông, tối thiểu 200x200px</li>
          <li>Ảnh sẽ tự động resize và tối ưu khi upload</li>
        </ul>
      </div>

      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-section">
          <h4>🔧 Debug - Hoạt động 3</h4>
          <div className="debug-info">
            <p><strong>File selected:</strong> {file ? file.name : 'None'}</p>
            <p><strong>File size:</strong> {file ? `${(file.size / 1024).toFixed(1)} KB` : 'N/A'}</p>
            <p><strong>Preview:</strong> {preview ? '✓ Yes' : '✗ No'}</p>
            <p><strong>Current avatar URL:</strong></p>
            <code>{currentAvatar || 'No avatar'}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;

/*
 * HOẠT ĐỘNG 3: AVATAR UPLOAD COMPONENT
 * 
 * Chức năng:
 * 1. Chọn file ảnh
 * 2. Validate: Type (jpg/png), Size (max 5MB)
 * 3. Preview ngay lập tức
 * 4. Upload lên backend
 * 5. Backend xử lý: Resize + Upload Cloudinary
 * 6. Nhận URL từ Cloudinary
 * 7. Update avatar
 * 
 * Backend API cần:
 * POST /api/users/avatar
 * - Content-Type: multipart/form-data
 * - Body: FormData với key 'avatar'
 * - Response: { avatarUrl: "https://cloudinary..." }
 * 
 * Flow:
 * User chọn file → Preview → Click Upload
 * → POST /users/avatar (FormData)
 * → Backend: Multer nhận file
 * → Sharp resize
 * → Cloudinary upload
 * → Response avatarUrl
 * → Frontend update UI
 */