import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SuppliersList } from './pages/SuppliersList';
import { MedicineList } from './pages/MedicineList';
import { InventoryList } from './pages/InventoryList';
import { StockManagement } from './pages/StockManagement';
import { StockHistory } from './pages/StockHistory';
import { LowStockAlerts } from './pages/LowStockAlerts';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div style={{ color: '#fff', padding: '40px', textAlign: 'center' }}>Loading MediStock Portal...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ProtectedLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="suppliers" element={<SuppliersList />} />
              <Route path="medicines" element={<MedicineList />} />
              <Route path="inventory" element={<InventoryList />} />
              <Route path="stock-management" element={<StockManagement />} />
              <Route path="stock-history" element={<StockHistory />} />
              <Route path="low-stock" element={<LowStockAlerts />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
