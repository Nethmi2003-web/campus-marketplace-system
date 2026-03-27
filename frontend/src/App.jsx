import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplaceUI from './components/MarketplaceUI';
import MarketplacePage from './pages/MarketplacePage';
import ItemDetailPage from './pages/ItemDetailPage';
import AddItemPage from './pages/AddItemPage';
import SellItemPage from './pages/SellItemPage';
import ItemPosterPage from './pages/ItemPosterPage';
import MyListingsPage from './pages/MyListingsPage';

// Isolated Dashboards
import UserDasboardd from './pages/UserDasboardd';
import AdmnDashboardd from './pages/AdmnDashboardd';

// Components
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

import React, { useEffect } from 'react';

function App() {
  // Global Cross-Tab Session Sync (Role-Isolated)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin_userInfo' || e.key === 'std_userInfo') {
        // If a specific role session changes, refresh to sync all tabs of that role
        window.location.reload();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Routes wrapped in the Main Layout */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDasboardd />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="/items" element={<MainLayout><MarketplaceUI /></MainLayout>} />

        {/* Item Management Component */}
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route
          path="/items/new"
          element={
            <ProtectedRoute>
              <AddItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/:id/edit"
          element={
            <ProtectedRoute>
              <Navigate to="/items/my-listings" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/my-listings"
          element={
            <ProtectedRoute>
              <MyListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/sell"
          element={
            <ProtectedRoute>
              <SellItemPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/items/poster/:id"
          element={
            <ProtectedRoute>
              <ItemPosterPage />
            </ProtectedRoute>
          }
        />

        {/* Fully Isolated Role-Based Dashboards */}
        <Route path="/user-dashboard" element={<UserDasboardd />} />
        <Route path="/admin-dashboard" element={<AdmnDashboardd />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
