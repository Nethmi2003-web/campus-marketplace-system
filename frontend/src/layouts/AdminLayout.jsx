import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Search, Bell, ShoppingCart, Heart } from 'lucide-react';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.adminContainer}>
      {/* Top Navbar matching the screenshot */}
      <header className={styles.topNavbar}>
        <div className={styles.logoSection}>
          <div className={styles.logoIcon}>S</div>
          <div className={styles.logoTextWrapper}>
            <span className={styles.logoTitle}>SLIIT MARKETPLACE</span>
            <span className={styles.logoSubtitle}>DIGITAL CAMPUS</span>
          </div>
        </div>
        
        <div className={styles.searchSection}>
           <div className={styles.searchBar}>
             <Search size={18} />
             <input type="text" placeholder="Search items, events, users..." />
           </div>
        </div>
        
        <div className={styles.profileSection}>
           <ShoppingCart size={20} className={styles.navIcon} />
           <Heart size={20} className={styles.navIcon} />
           <Bell size={20} className={styles.navIcon} />
           
           <div className={styles.userInfo}>
             <div className={styles.userText}>
               <span className={styles.userName}>vinu</span>
               <span className={styles.userRole}>ADMIN</span>
             </div>
             <div className={styles.avatar}>
               <UserAvatarOutline />
             </div>
           </div>
        </div>
      </header>

      {/* Main Body */}
      <div className={styles.bodyWrapper}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <NavLink 
              to="/admin" 
              end 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Users size={20} />
              User Management
            </NavLink>
          </nav>
          
          <button className={styles.logoutBtn} onClick={() => navigate('/login')}>
            <LogOut size={20} />
            Logout Session
          </button>
        </aside>
        
        <main className={styles.mainContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Helper to draw the user avatar exactly like the screenshot
const UserAvatarOutline = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default AdminLayout;
