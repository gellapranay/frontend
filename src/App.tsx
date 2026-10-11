import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { DeliveryPartnerDashboard } from './pages/DeliveryPartnerDashboard';
import { FacilityAdminDashboard } from './pages/FacilityAdminDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<LoginPage />} />

          {/* Protected Role-Based Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/delivery-partner"
            element={
              <ProtectedRoute allowedRoles={['DELIVERY_PARTNER', 'SUPER_ADMIN']}>
                <DeliveryPartnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/facility-admin"
            element={
              <ProtectedRoute allowedRoles={['FACILITY_ADMIN', 'SUPER_ADMIN']}>
                <FacilityAdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
