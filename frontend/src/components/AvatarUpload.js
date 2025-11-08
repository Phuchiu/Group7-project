import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAvatar } from '../store/authSlice';
import api from '../services/api';

// Sanitize and validate base64 image source
const sanitizeImageSrc = (src) => {
  if (!src) return '';
  
  console.log('Original src type:', typeof src, 'length:', src.length);
  
  // If it's a data URL (base64), validate and return
  if (src.startsWith('data:image/')) {
    console.log('Base64 image detected');
    return src;
  }
  
  console.log('Invalid image source');
  return '';
};

const AvatarUpload = ({ currentAvatar, onAvatarUpdate }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  // Update preview when currentAvatar or user.avatar changes
  useEffect(() => {
    const avatarToShow = user?.avatar || currentAvatar;
    console.log('Setting preview to:', avatarToShow);
    setPreview(avatarToShow);
  }, [currentAvatar, user?.avatar]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Clear previous messages immediately
      setError('');
      setSuccess('');
      
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

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/api/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Upload response:', response.data);
      setError('');
      setSuccess('Upload avatar thành công!');
      
      // Set preview with the base64 avatar data from response
      const avatarData = response.data.avatar;
      console.log('Avatar data received:', avatarData ? 'Base64 data present' : 'No data');
      setPreview(avatarData);
      onAvatarUpdate && onAvatarUpdate(avatarData);
      // Update Redux store
      dispatch(updateAvatar(avatarData));
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      setSuccess(''); // Clear any existing success
      setError(error.response?.data?.message || 'Upload thất bại');
      setPreview(currentAvatar); // Reset preview
    } finally {
      setUploading(false);
    }
  };

  const deleteAvatar = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa avatar?')) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      await api.delete('/api/avatar/delete');
      
      setError(''); // Clear any existing error
      setSuccess('Xóa avatar thành công!');
      setPreview(null);
      onAvatarUpdate && onAvatarUpdate(null);
      // Update Redux store
      dispatch(updateAvatar(null));
    } catch (error) {
      setSuccess(''); // Clear any existing success
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
            <img 
              src={sanitizeImageSrc(preview)} 
              alt="Avatar" 
              className="avatar-image"
              onError={(e) => {
                console.error('Avatar load error:', e.target.src);
                setError('Không thể tải ảnh avatar');
              }}
            />
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