import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import ManagerDashboard from './pages/ManagerDashboard';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Layout Wrapper ONLY */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Employee Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="apply-leave"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />

            <Route
              path="leave-history"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <LeaveHistory />
                </ProtectedRoute>
              }
            />

            {/* Manager */}
            <Route
              path="manager"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;