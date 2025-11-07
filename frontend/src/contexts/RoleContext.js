import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/api/rbac/permissions');
      setPermissions(response.data.permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      fetchPermissions();
    } else {
      setLoading(false);
    }
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasRole = (role) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === role;
  };

  const hasAnyRole = (roles) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return roles.includes(user.role);
  };

  return (
    <RoleContext.Provider value={{
      permissions,
      hasPermission,
      hasRole,
      hasAnyRole,
      loading,
      refreshPermissions: fetchPermissions
    }}>
      {children}
    </RoleContext.Provider>
  );
};