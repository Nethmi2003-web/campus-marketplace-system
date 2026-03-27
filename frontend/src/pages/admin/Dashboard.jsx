import React from 'react';
import { Users, UserX, ShieldQuestion, Store, UserCheck, Clock } from 'lucide-react';
import styles from './AdminPages.module.css';

const Dashboard = () => {
  // Static metrics based on prompt requirements
  const metrics = [
    { label: 'Total Users', value: '250', icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Pending Verification', value: '18', icon: Clock, color: '#f59e0b', bg: '#fffbeb' },
    { label: 'Active Sellers', value: '76', icon: Store, color: '#10b981', bg: '#ecfdf5' },
    { label: 'Blocked Users', value: '4', icon: UserX, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Total Admins', value: '3', icon: ShieldQuestion, color: '#8b5cf6', bg: '#f5f3ff' },
    { label: 'Recent Registrations', value: '24', icon: UserCheck, color: '#ec4899', bg: '#fdf2f8' },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome, vinu!</h1>
        <p className={styles.welcomeSubtitle}>Manage your marketplace users and administration duties</p>
      </div>

      <div className={styles.gridContainer}>
        {metrics.map((metric, idx) => (
          <div key={idx} className={styles.metricCard}>
            <div className={styles.metricIconWrapper} style={{ backgroundColor: metric.bg, color: metric.color }}>
              <metric.icon size={26} strokeWidth={2.5} />
            </div>
            <div className={styles.metricInfo}>
              <h3 className={styles.metricValue}>{metric.value}</h3>
              <p className={styles.metricLabel}>{metric.label}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual placeholder for future charts if needed */}
      <div className={styles.chartSection}>
        <div className={styles.chartCard}>
          <h3 className={styles.cardSectionTitle}>Recent Activity Pipeline</h3>
          <div className={styles.placeholderChart}>
            <div className={styles.pulseDot} />
            <p>Waiting for live backend metrics to paint timeline...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
