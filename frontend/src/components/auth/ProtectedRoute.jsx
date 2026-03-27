import React from 'react';
import { Navigate } from 'react-router-dom';

const readToken = () => {
  const directToken = localStorage.getItem('token');
  if (directToken) {
    return directToken;
  }

  const studentRaw = localStorage.getItem('std_userInfo');
  if (studentRaw) {
    try {
      const student = JSON.parse(studentRaw);
      if (student?.token) {
        return student.token;
      }
    } catch (error) {
      return null;
    }
  }

  const adminRaw = localStorage.getItem('admin_userInfo');
  if (adminRaw) {
    try {
      const admin = JSON.parse(adminRaw);
      if (admin?.token) {
        return admin.token;
      }
    } catch (error) {
      return null;
    }
  }

  return null;
};

function ProtectedRoute({ children }) {
  const token = readToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
