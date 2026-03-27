import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { User, Mail, Lock, CreditCard, ShieldCheck, ShieldAlert } from 'lucide-react'; // Added Shield Alert
import styles from '../styles/Form.module.css';
import { registerUser } from '../services/authService';
import { validateUniversityEmail, validatePasswordStrength, validateRequired, validatePhone, validateStudentId } from '../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    studentId: '',
    faculty: '',
    phoneNo: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
    termsAgreed: false
  });
  const [idPhoto, setIdPhoto] = useState(null);
  
  // OTP logic states
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  
  // Anti-Spam Security Hooks
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [showOtpWarning, setShowOtpWarning] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Controls which view is shown on the left panel: 'idle' | 'typing' | 'error'
  const [leftView, setLeftView] = useState('idle');
  const typingTimeoutRef = React.useRef(null);
  const errorTimeoutRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setIdPhoto(files[0] || null);
      setErrors(prev => ({ ...prev, idPhoto: null }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
    
    // Show marketplace SVG when user types
    setLeftView('typing');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setLeftView('idle');
    }, 2000);

    // Clear field-specific error
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    newErrors.fullName = validateRequired(formData.fullName, 'Full Name');
    newErrors.studentId = validateStudentId(formData.studentId);
    newErrors.faculty = validateRequired(formData.faculty, 'Faculty');
    newErrors.phoneNo = validatePhone(formData.phoneNo);
    if (!idPhoto) newErrors.idPhoto = 'Student ID Photo is required';
    
    newErrors.email = validateUniversityEmail(formData.email);
    if (!isOtpVerified) newErrors.email = newErrors.email || 'Email must be verified first';
    
    newErrors.password = validatePasswordStrength(formData.password);
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.termsAgreed) {
      newErrors.termsAgreed = 'You must agree to the terms to register';
    }
    
    // Strip nulls
    Object.keys(newErrors).forEach(key => newErrors[key] === null && delete newErrors[key]);
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      // Show the error SVG on the left
      setLeftView('error');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      // Auto-revert to idle after 3 seconds
      errorTimeoutRef.current = setTimeout(() => {
        setLeftView('idle');
      }, 3000);
      return false;
    }
    
    return true;
  };

  const handleSendOtp = () => {
    if (isBlocked) return; // Hard block stop

    const emailErr = validateUniversityEmail(formData.email);
    if (emailErr) {
      setErrors(prev => ({ ...prev, email: emailErr }));
      return;
    }
    
    // Throttling Check
    const newAttempts = otpAttempts + 1;
    if (newAttempts > 3) {
      setIsBlocked(true);
      setShowOtpWarning(true);
      return;
    }

    setOtpAttempts(newAttempts);
    setShowOtpWarning(true); // Fire Modal Sequence
    setIsSendingOtp(true);
    
    // Mock network logic
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (formData.otp.length >= 6) {
      setIsOtpVerified(true);
      alert('Email Verified Successfully!');
    } else {
      setErrors(prev => ({...prev, otp: 'Invalid OTP Code'}));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      // Simulate registration payload
      await registerUser({ ...formData, idPhoto });
      alert("Registration Successful!");
      navigate('/login');
    } catch (err) {
      setServerError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout leftView={leftView}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        {serverError && <div className={styles.errorBanner}>{serverError}</div>}

        {isBlocked ? (
          <div className={styles.blockedContainer}>
             <ShieldAlert size={80} color="#ef4444" style={{marginBottom: '1rem'}}/>
             <h2 style={{color: '#111827', marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '800'}}>Registration Locked</h2>
             <p style={{color: '#dc2626', fontWeight: '600', fontSize: '1.2rem', padding: '0 1rem'}}>
               Your device has been shadow-banned for 7 Days.
             </p>
             <p style={{color: '#64748b', marginTop: '1rem'}}>
               You exceeded the maximum threshold of 3 Automated OTP routing requests.
             </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Row 1 */}
          <div className={styles.row}>
            <Input 
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />
            <Input 
              label="Student ID"
              name="studentId"
              placeholder="IT21000000"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
            />
          </div>

          {/* Row 2 */}
          <div className={styles.row}>
            <Input 
              label="Faculty"
              name="faculty"
              type="select"
              options={['Computing', 'Business', 'Engineering', 'Humanities & Sciences', 'Architecture']}
              placeholder="Select Faculty"
              value={formData.faculty}
              onChange={handleChange}
              error={errors.faculty}
            />
            <Input 
              label="Phone Number"
              name="phoneNo"
              placeholder="+94 77 123 4567"
              value={formData.phoneNo}
              onChange={handleChange}
              error={errors.phoneNo}
            />
          </div>

          <Input 
            label="Student ID Photo"
            name="idPhoto"
            type="file"
            accept="image/*"
            onChange={handleChange}
            error={errors.idPhoto}
          />

          {/* Row 3: Email & OTP Mechanism */}
          <div className={styles.row} style={{ alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Input 
                label="University Email"
                name="email"
                type="email"
                placeholder="it21000000@my.sliit.lk"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isOtpVerified}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '1.8rem', width: '130px' }}>
              {!isOtpSent && !isOtpVerified && (
                <Button type="button" onClick={handleSendOtp} isLoading={isSendingOtp}>
                  Send OTP
                </Button>
              )}
              {isOtpSent && !isOtpVerified && (
                <Button type="button" onClick={handleVerifyOtp} variant="outlined" style={{ padding: '0.6rem 1rem' }}>
                  Verify
                </Button>
              )}
              {isOtpVerified && (
                <Button type="button" variant="primary" disabled style={{ backgroundColor: '#10b981' }}>
                  <ShieldCheck size={18} /> Verified
                </Button>
              )}
            </div>
          </div>
          
          {/* OTP Input Field & Resend OTP */}
          {isOtpSent && !isOtpVerified && (
            <div style={{ position: 'relative' }}>
              <button 
                type="button" 
                onClick={handleSendOtp} 
                className={styles.link}
                style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Resend OTP
              </button>
              <Input 
                label="Enter 6-Digit OTP Code"
                name="otp"
                placeholder="123456"
                value={formData.otp}
                onChange={handleChange}
                error={errors.otp}
              />
            </div>
          )}
          
          {/* Row 4 */}
          <div className={styles.row}>
            <Input 
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              isPassword={true}
              error={errors.password}
            />
            <Input 
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              isPassword={true}
              error={errors.confirmPassword}
            />
          </div>
          
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              name="termsAgreed"
              id="termsAgreed"
              checked={formData.termsAgreed}
              onChange={handleChange}
            />
            <label htmlFor="termsAgreed" className={styles.checkboxText}>
              I agree to the <span className={styles.link}>Terms of Service</span> and <span className={styles.link}>Privacy Policy</span> of Campus Marketplace.
              {errors.termsAgreed && <span className={styles.errorMessage} style={{ display: 'block', marginTop: '4px' }}>{errors.termsAgreed}</span>}
            </label>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Create Account
          </Button>
        </form>
        )}
      </div>

      {/* Synchronized Security Rendering Hooks */}
      {showOtpWarning && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>
               <ShieldAlert size={36} strokeWidth={2.5}/>
            </div>
            {isBlocked ? (
              <>
                <h2 className={styles.modalTitle}>IP Blocked for 1 Week</h2>
                <p className={styles.modalText}>
                  You have exceeded the maximum of 3 OTP validation requests. Our Security Algorithms have locked your IP/Email address for exactly 7 days.
                </p>
                <div style={{color: '#ef4444', fontWeight: '800', fontSize: '1.1rem', marginTop: '1rem'}}>ACCESS DENIED</div>
              </>
            ) : (
              <>
                <h2 className={styles.modalTitle}>Security Protocol Warning</h2>
                <p className={styles.modalText}>
                  OTP secure code has been routed to your EDU email. <br/><br/>
                  <strong style={{color: '#ef4444'}}>CAUTION:</strong> If you spam "Resend OTP" more than 3 times, the Anti-Fraud Engine will automatically blacklist your IP for exactly 1 Week.<br/><br/>
                  <span style={{background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: 'bold', border: '1px solid #cbd5e1'}}>Attempts Logged: {otpAttempts} / 3</span>
                </p>
                <button onClick={() => setShowOtpWarning(false)} className={styles.modalBtn}>I Understand</button>
              </>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default Register;
