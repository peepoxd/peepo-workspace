import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './hooks/useAuthStore';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProposalsPage from './pages/proposals/ProposalsPage';
import ProposalFormPage from './pages/proposals/ProposalFormPage';
import ScreeningPage from './pages/ScreeningPage';
import ApprovalPage from './pages/ApprovalPage';
import ContractsPage from './pages/ContractsPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/proposals" element={<ProposalsPage />} />
                    <Route path="/proposals/new" element={<ProposalFormPage />} />
                    <Route path="/proposals/:id" element={<ProposalFormPage />} />
                    <Route path="/screening" element={<ScreeningPage />} />
                    <Route path="/approval" element={<ApprovalPage />} />
                    <Route path="/contracts" element={<ContractsPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  );
}
