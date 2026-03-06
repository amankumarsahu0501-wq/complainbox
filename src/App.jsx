import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/auth/Login';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const Unauthorized = () => <div className="container mt-8 text-center p-8 bg-white rounded shadow"><h2>Unauthorized Access</h2><p>You do not have permission to view this page.</p></div>;

// Role-based protection component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Layout component
const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>PS-CRM Command Center</h1>
        {currentUser && (
          <div className="user-menu">
            <span className="hidden sm:inline-block">
              {currentUser.name} <span className="text-muted text-xs bg-slate-100 px-2 py-1 rounded ml-1">{currentUser.role}</span>
            </span>
            <button onClick={logout} className="text-sm font-semibold text-primary hover:underline bg-transparent border-0 cursor-pointer">
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="app-content">
        {children}
      </main>
    </div>
  );
};

const App = () => {
  const { currentUser, isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={
            isAuthenticated ? (
              currentUser.role === 'citizen' ? <Navigate to="/citizen" replace /> :
                currentUser.role === 'officer' ? <Navigate to="/officer" replace /> :
                  <Navigate to="/admin" replace />
            ) : <Login />
          } />

          {/* Citizen Routes */}
          <Route path="/citizen" element={
            <ProtectedRoute allowedRoles={['citizen']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />

          {/* Officer Routes */}
          <Route path="/officer" element={
            <ProtectedRoute allowedRoles={['officer']}>
              <OfficerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Default redirect based on auth status and role */}
          <Route path="/" element={
            isAuthenticated ? (
              currentUser.role === 'citizen' ? <Navigate to="/citizen" replace /> :
                currentUser.role === 'officer' ? <Navigate to="/officer" replace /> :
                  <Navigate to="/admin" replace />
            ) : <Navigate to="/login" replace />
          } />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
