import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

// Simulated user database for demo - In production, this would be API calls
const DEMO_USERS = {
  'requester@umb.com.gh': {
    id: 'USR001',
    email: 'requester@umb.com.gh',
    name: 'Zeinab Abubakar',
    role: 'requesting_unit',
    department: 'Operations',
    password: 'Demo@123'
  },
  'approver@umb.com.gh': {
    id: 'USR002',
    email: 'approver@umb.com.gh',
    name: 'Joshua Lomotey',
    role: 'unit_approver',
    department: 'Operations',
    password: 'Demo@123'
  },
  'compliance@umb.com.gh': {
    id: 'USR003',
    email: 'compliance@umb.com.gh',
    name: 'Derrick Akomeah',
    role: 'compliance_officer',
    department: 'Compliance',
    password: 'Demo@123'
  },
  'procurement@umb.com.gh': {
    id: 'USR004',
    email: 'procurement@umb.com.gh',
    name: 'Brenda Johnson',
    role: 'procurement_officer',
    department: 'Procurement',
    password: 'Demo@123'
  },
  'admin@umb.com.gh': {
    id: 'USR005',
    email: 'admin@umb.com.gh',
    name: 'Solomon Razak',
    role: 'admin',
    department: 'IT Administration',
    password: 'Admin@123'
  }
};

const ROLE_LABELS = {
  requesting_unit: 'Requesting Unit',
  unit_approver: 'Unit Approver',
  compliance_officer: 'Compliance Officer',
  procurement_officer: 'Procurement Officer',
  admin: 'System Administrator'
};

const ROLE_PERMISSIONS = {
  requesting_unit: ['create_request', 'view_own_requests', 'respond_clarification', 'view_tracking'],
  unit_approver: ['approve_requests', 'reject_requests', 'request_clarification', 'view_department_requests'],
  compliance_officer: ['compliance_review', 'approve_compliance', 'reject_compliance', 'request_clarification'],
  procurement_officer: ['procurement_review', 'assign_vendor', 'approve_procurement', 'view_all_requests'],
  admin: ['manage_categories', 'manage_departments', 'manage_users', 'view_reports', 'full_access']
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Session timeout duration (30 minutes)
  const SESSION_DURATION = 30 * 60 * 1000;

  // Check for existing session on mount
  useEffect(() => {
    const storedSession = sessionStorage.getItem('umb_procurement_session');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const now = Date.now();
        if (session.expiresAt > now) {
          setUser(session.user);
          startSessionTimer(session.expiresAt - now);
        } else {
          sessionStorage.removeItem('umb_procurement_session');
        }
      } catch (e) {
        sessionStorage.removeItem('umb_procurement_session');
      }
    }
    setIsLoading(false);
  }, []);

  const startSessionTimer = useCallback((duration) => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    const timeout = setTimeout(() => {
      logout();
      alert('Your session has expired. Please log in again.');
    }, duration);
    setSessionTimeout(timeout);
  }, [sessionTimeout]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validate credentials
    const normalizedEmail = email.toLowerCase().trim();
    const userRecord = DEMO_USERS[normalizedEmail];
    
    if (!userRecord) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    if (userRecord.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password');
    }
    
    // Create session
    const { password: _, ...userWithoutPassword } = userRecord;
    const expiresAt = Date.now() + SESSION_DURATION;
    
    const session = {
      user: userWithoutPassword,
      expiresAt,
      loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem('umb_procurement_session', JSON.stringify(session));
    setUser(userWithoutPassword);
    startSessionTimer(SESSION_DURATION);
    setIsLoading(false);
    
    return userWithoutPassword;
  }, [startSessionTimer]);

  const logout = useCallback(() => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    sessionStorage.removeItem('umb_procurement_session');
    setUser(null);
  }, [sessionTimeout]);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role] || [];
    return permissions.includes(permission) || permissions.includes('full_access');
  }, [user]);

  const getRoleLabel = useCallback((role) => {
    return ROLE_LABELS[role] || role;
  }, []);

  const refreshSession = useCallback(() => {
    if (user) {
      const expiresAt = Date.now() + SESSION_DURATION;
      const session = {
        user,
        expiresAt,
        loginTime: new Date().toISOString()
      };
      sessionStorage.setItem('umb_procurement_session', JSON.stringify(session));
      startSessionTimer(SESSION_DURATION);
    }
  }, [user, startSessionTimer]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    getRoleLabel,
    refreshSession,
    ROLE_LABELS,
    DEMO_USERS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
