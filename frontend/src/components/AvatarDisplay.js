import React from 'react';

const AvatarDisplay = ({ avatar, name, size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium', 
    large: 'avatar-large'
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    // If it's base64 data, return as is
    if (avatar.startsWith('data:image/')) return avatar;
    // Legacy support for URL paths
    if (avatar.startsWith('http')) return avatar;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
    return `${API_URL}${avatar}`;
  };

  return (
    <div className={`avatar-display ${sizeClasses[size]} ${className}`}>
      {avatar ? (
        <img 
          src={getAvatarUrl(avatar)} 
          alt={`${name}'s avatar`}
          className="avatar-img"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      
      <div 
        className="avatar-fallback"
        style={{ display: avatar ? 'none' : 'flex' }}
      >
        {getInitials(name)}
      </div>
    </div>
  );
};

export default AvatarDisplay;