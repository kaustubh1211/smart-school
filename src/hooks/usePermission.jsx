import { useMemo } from 'react';

// Same permission structure as backend
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    students: ['view', 'add', 'edit', 'delete'],
    fees: ['view', 'add', 'edit', 'delete', 'collect'],
    feeStructure: ['view', 'add', 'edit', 'delete'],
    classes: ['view', 'add', 'edit', 'delete'],
    teachers: ['view', 'add', 'edit', 'delete'],
    expense: ['view', 'add', 'edit', 'delete'],
    income: ['view', 'add', 'edit', 'delete'],
    enquiry: ['view', 'add', 'edit', 'delete'],
    reports: ['view', 'generate'],
    settings: ['view', 'edit'],
    admins: ['view', 'add', 'edit', 'delete'],
    certificates: ['view', 'add', 'delete'],
  },

  ADMIN: {
    students: ['view', 'add', 'edit'],
    fees: ['view', 'add', 'edit', 'collect'],
    feeStructure: ['view', 'add', 'edit'],
    classes: ['view', 'add', 'edit'],
    teachers: ['view', 'add', 'edit'],
    expense: ['view', 'add', 'edit'],
    income: ['view', 'add', 'edit'],
    enquiry: ['view', 'add', 'edit'],
    reports: ['view', 'generate'],
    settings: ['view'],
    admins: ['view'],
    certificates: ['view', 'add', 'delete'],
  },

  CLERK: {
    students: ['view', 'add', 'edit'],
    fees: ['view', 'collect'],
    feeStructure: ['view'],
    classes: ['view'],
    enquiry: ['view', 'add', 'edit'],
    reports: ['view'],
    certificates: ['view', 'add'],
  },

  ACCOUNTANT: {
    students: ['view'],
    fees: ['view', 'add', 'edit', 'collect'],
    feeStructure: ['view', 'add', 'edit'],
    expense: ['view', 'add', 'edit'],
    income: ['view', 'add', 'edit'],
    reports: ['view', 'generate'],
    certificates: ['view'],
  },

  TEACHER: {
    students: ['view'],
    classes: ['view'],
    reports: ['view'],
    certificates: ['view'],
  },
};

export const usePermissions = () => {
  const role = localStorage.getItem('role');

  const can = useMemo(() => {
    return (module, action) => {
      if (!role || !module || !action) return false;

      const rolePermissions = ROLE_PERMISSIONS[role];
      if (!rolePermissions) return false;

      const modulePermissions = rolePermissions[module];
      if (!modulePermissions) return false;

      return modulePermissions.includes(action);
    };
  }, [role]);

  const hasRole = useMemo(() => {
    return (...allowedRoles) => {
      return allowedRoles.includes(role);
    };
  }, [role]);

  const canAny = useMemo(() => {
    return (checks) => {
      return checks.some(([module, action]) => can(module, action));
    };
  }, [can]);

  const canAll = useMemo(() => {
    return (checks) => {
      return checks.every(([module, action]) => can(module, action));
    };
  }, [can]);

  return {
    role,
    can,
    hasRole,
    canAny,
    canAll,
  };
};