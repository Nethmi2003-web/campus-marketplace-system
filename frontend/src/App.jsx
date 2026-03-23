import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplaceUI from './pages/User/MarketplaceUI';

// Isolated Dashboards
import UserDasboardd from './pages/UserDasboardd';
import AdmnDashboardd from './pages/AdmnDashboardd';

// Components
import MainLayout from './components/MainLayout';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Routes wrapped in the Main Layout */}
        <Route path="/" element={<MainLayout><LoginPage /></MainLayout>} />
        <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
        <Route path="/items" element={<MainLayout><MarketplaceUI /></MainLayout>} />

        {/* Fully Isolated Role-Based Dashboards */}
        <Route path="/user-dashboard" element={<UserDasboardd />} />
        <Route path="/admin-dashboard" element={<AdmnDashboardd />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
