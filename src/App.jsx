import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import ApprovalScreen from './pages/ApprovalScreen';
import ComplianceReview from './pages/ComplianceReview';
import ProcurementQueue from './pages/ProcurementQueue';
import RequestDetail from './pages/RequestDetail';
import ClarificationThread from './pages/ClarificationThread';
import StatusTracker from './pages/StatusTracker';
import AdminPanel from './pages/AdminPanel';
import MyRequests from './pages/MyRequests';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/my-requests"
        element={
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/create-request"
        element={
          <ProtectedRoute allowedRoles={['requesting_unit', 'admin']}>
            <CreateRequest />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/approvals"
        element={
          <ProtectedRoute allowedRoles={['unit_approver', 'admin']}>
            <ApprovalScreen />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/compliance"
        element={
          <ProtectedRoute allowedRoles={['compliance_officer', 'admin']}>
            <ComplianceReview />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/procurement"
        element={
          <ProtectedRoute allowedRoles={['procurement_officer', 'admin']}>
            <ProcurementQueue />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/request/:id"
        element={
          <ProtectedRoute>
            <RequestDetail />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/clarification/:id"
        element={
          <ProtectedRoute>
            <ClarificationThread />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/tracking/:id"
        element={
          <ProtectedRoute>
            <StatusTracker />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
