import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import AuthLayout from './layouts/AuthLayout.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import NotFound from './pages/NotFound.jsx';

import Dashboard from './pages/customer/Dashboard.jsx';
import Accounts from './pages/customer/Accounts.jsx';
import CreateAccount from './pages/customer/CreateAccount.jsx';
import Transfer from './pages/customer/Transfer.jsx';
import Transactions from './pages/customer/Transactions.jsx';
import Profile from './pages/customer/Profile.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import FraudAlerts from './pages/admin/FraudAlerts.jsx';
import AuditLogs from './pages/admin/AuditLogs.jsx';

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Routes>
      {/* Public auth routes — redirect away if already logged in */}
      <Route
        element={
          isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <AuthLayout />
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Authenticated shell */}
      <Route element={<DashboardLayout />}>
        {/* Customer routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/new"
          element={
            <ProtectedRoute>
              <CreateAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer"
          element={
            <ProtectedRoute>
              <Transfer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/fraud-alerts"
          element={
            <ProtectedRoute adminOnly>
              <FraudAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute adminOnly>
              <AuditLogs />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/" element={<Navigate to={isAuthenticated ? (isAdmin ? '/admin' : '/dashboard') : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
