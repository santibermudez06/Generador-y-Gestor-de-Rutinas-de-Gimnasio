import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActiveWorkoutProvider } from './context/ActiveWorkoutContext';
import MainLayout from './layouts/MainLayout';

// Páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RoutinesPage from './pages/RoutinesPage';
import RoutineEditorPage from './pages/RoutineEditorPage';
import ExercisesPage from './pages/ExercisesPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import HistoryPage from './pages/HistoryPage';
import ProgressPage from './pages/ProgressPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// Guardián para proteger rutas privadas
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)'
        }}
      >
        <LoadingSpinner text="Iniciando entorno deportivo FORGE..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Guardián para redirigir usuarios autenticados que intenten entrar a login/register
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ActiveWorkoutProvider>
          <Routes>
            {/* Rutas Públicas */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* Rutas Privadas / Protegidas con Layout Principal */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="routines" element={<RoutinesPage />} />
              <Route path="routines/new" element={<RoutineEditorPage />} />
              <Route path="routines/:id/edit" element={<RoutineEditorPage />} />
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="active-workout" element={<ActiveWorkoutPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ActiveWorkoutProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

