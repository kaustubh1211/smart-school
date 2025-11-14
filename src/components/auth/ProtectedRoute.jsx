import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermission';
import Toast from '../ui/Toast';

const ProtectedRoute = ({ module, action, roles, children }) => {
  const { can, hasRole } = usePermissions();

  // Check by permission (module + action)
  if (module && action) {
    if (!can(module, action)) {
      Toast.showErrorToast("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check by role
  if (roles) {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!hasRole(...allowedRoles)) {
      Toast.showErrorToast("You don't have permission to access this page");
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;