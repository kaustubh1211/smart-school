import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';

// Component to show/hide based on permission
export const Can = ({ module, action, children, fallback = null }) => {
  const { can } = usePermissions();

  if (!can(module, action)) {
    return fallback;
  }

  return <>{children}</>;
};

// Component to check role
export const HasRole = ({ roles, children, fallback = null }) => {
  const { hasRole } = usePermissions();

  if (!hasRole(...(Array.isArray(roles) ? roles : [roles]))) {
    return fallback;
  }

  return <>{children}</>;
};

export default Can;