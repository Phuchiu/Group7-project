import React, { useState, useRef } from 'react';
import api from '../services/api';

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Chỉ cho phép upload file ảnh');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File không được vượt quá 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload file
      uploadAvatar(file);
    }
  };

  const uploadAvatar = async (file) => {
    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/api/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Upload avatar thành công!');
      setPreview(response.data.avatar);
      onAvatarUpdate(response.data.avatar);

    } catch (error) {
      setError(error.response?.data?.message || 'Upload thất bại');
      setPreview(currentAvatar); // Reset preview
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa avatar?')) return;

    try {
      setUploading(true);
      await api.delete('/api/avatar/delete');
      
      setSuccess('Xóa avatar thành công!');
      setPreview('');
      onAvatarUpdate('');
    } catch (error) {
      setError(error.response?.data?.message || 'Xóa avatar thất bại');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="avatar-upload">
      <h4>📸 Avatar</h4>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="avatar-container">
        <div className="avatar-preview" onClick={triggerFileInput}>
          {preview ? (
            <img src={preview} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              <span>📷</span>
              <p>Click để upload</p>
            </div>
          )}
          {uploading && <div className="avatar-loading">Uploading...</div>}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className="avatar-actions">
          <button 
            onClick={triggerFileInput}
            disabled={uploading}
            className="upload-btn"
          >
            {uploading ? 'Đang upload...' : 'Chọn ảnh'}
          </button>
          
          {preview && (
            <button 
              onClick={deleteAvatar}
              disabled={uploading}
              className="delete-avatar-btn"
            >
              Xóa avatar
            </button>
          )}
        </div>
      </div>

      <div className="upload-info">
        <p>• Chỉ cho phép file ảnh (JPG, PNG, GIF)</p>
        <p>• Kích thước tối đa: 5MB</p>
        <p>• Ảnh sẽ được resize thành 300x300px</p>
      </div>
    </div>
  );
};

export default AvatarUpload;