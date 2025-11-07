import React, { useState, useEffect } from 'react';
import { TokenManager } from '../services/api';

const TokenStatus = () => {
  const [tokenInfo, setTokenInfo] = useState({
    hasAccessToken: false,
    hasRefreshToken: false,
    accessTokenExpiry: null
  });

  useEffect(() => {
    const updateTokenInfo = () => {
      const accessToken = TokenManager.getAccessToken();
      const refreshToken = TokenManager.getRefreshToken();
      
      let accessTokenExpiry = null;
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          accessTokenExpiry = new Date(payload.exp * 1000);
        } catch (error) {
          console.error('Error parsing token:', error);
        }
      }

      setTokenInfo({
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenExpiry
      });
    };

    updateTokenInfo();
    const interval = setInterval(updateTokenInfo, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const isTokenExpired = tokenInfo.accessTokenExpiry && 
    new Date() > tokenInfo.accessTokenExpiry;

  return (
    <div className="token-status">
      <h3>🔐 Token Status (Dev Mode)</h3>
      <div className="token-info">
        <div className={`token-item ${tokenInfo.hasAccessToken ? 'active' : 'inactive'}`}>
          <span>Access Token: </span>
          <span>{tokenInfo.hasAccessToken ? '✅ Active' : '❌ Missing'}</span>
          {isTokenExpired && <span className="expired"> (EXPIRED)</span>}
        </div>
        
        <div className={`token-item ${tokenInfo.hasRefreshToken ? 'active' : 'inactive'}`}>
          <span>Refresh Token: </span>
          <span>{tokenInfo.hasRefreshToken ? '✅ Active' : '❌ Missing'}</span>
        </div>
        
        {tokenInfo.accessTokenExpiry && (
          <div className="token-expiry">
            <span>Expires: </span>
            <span>{tokenInfo.accessTokenExpiry.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenStatus;