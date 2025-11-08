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
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:3001${avatar}`;
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