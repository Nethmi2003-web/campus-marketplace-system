// A dummy service to mimic API calls. This bridges the frontend to future MERN setup.

export const loginUser = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Dummy check
      if (email === 'test@my.sliit.lk' && password === 'password123') {
        resolve({ success: true, token: 'dummy_jwt_token', user: { email } });
      } else {
        reject(new Error('Invalid credentials. Try test@my.sliit.lk / password123'));
      }
    }, 1500);
  });
};

export const registerUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Sending to backend:', userData);
      resolve({ success: true, message: 'OTP sent to email' });
    }, 1500);
  });
};

export const verifyOTP = async (otpCode) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otpCode === '123456') {
        resolve({ success: true, message: 'Verified successfully' });
      } else {
        reject(new Error('Invalid OTP. Use 123456.'));
      }
    }, 1500);
  });
};

export const sendPasswordResetInfo = async (email) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Reset link sent' });
    }, 1500);
  });
};

export const resetPassword = async (newPassword) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Password reset successful' });
    }, 1500);
  });
};
