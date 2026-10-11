import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight-900 flex items-center justify-center text-cyan-accent font-mono text-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-cyan-accent border-t-transparent rounded-full animate-spin" />
          <span>Authenticating Antarmarg Session...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their own dashboard
    switch (user.role) {
      case 'SUPER_ADMIN':
        return <Navigate to="/admin" replace />;
      case 'FACILITY_ADMIN':
        return <Navigate to="/facility-admin" replace />;
      case 'DELIVERY_PARTNER':
        return <Navigate to="/delivery-partner" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
