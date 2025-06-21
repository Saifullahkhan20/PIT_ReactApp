import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { authAPI } from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';

function Login() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '', confirmPassword: '', terms: false });
  const [forgotEmail, setForgotEmail] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signUpError, setSignUpError] = useState('');
  const [signInSuccess, setSignInSuccess] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  const allowedDomains = ['.com', '.pk', '.edu', '.yahoo', '.net'];
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return allowedDomains.some(domain => email.endsWith(domain)) && emailRegex.test(email);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInSuccess('');
    if (!validateEmail(signInData.email)) {
      setSignInError('Please enter a valid email with domain .com, .pk, .edu, .yahoo, or .net');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login({
        email: signInData.email,
        password: signInData.password
      });
      if (res.data.success && res.data.token) {
        setSignInSuccess('Successfully signed in!');
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        setTimeout(() => navigate('/'), 1200);
      } else {
        setSignInError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setSignInError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpError('');
    setSignUpSuccess('');
    if (!validateEmail(signUpData.email)) {
      setSignUpError('Please enter a valid email with domain .com, .pk, .edu, .yahoo, or .net');
      return;
    }
    if (signUpData.password.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }
    if (!signUpData.terms) {
      setSignUpError('You must agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password
      });
      if (res.data.success && res.data.token) {
        setSignUpSuccess('Account created successfully!');
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        setTimeout(() => navigate('/'), 1200);
      } else {
        setSignUpError(res.data.message || 'Error creating account');
      }
    } catch (err) {
      setSignUpError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotSuccess('');
    setForgotError('');
    if (!validateEmail(forgotEmail)) {
      setForgotError('Please enter a valid email with domain .com, .pk, .edu, .yahoo, or .net');
      return;
    }
    try {
      await authAPI.forgotPassword(forgotEmail);
      setForgotSuccess('Password reset link sent to your email!');
      setTimeout(() => {
        setShowForgot(false);
        setForgotEmail('');
        setForgotSuccess('');
      }, 1500);
    } catch (err) {
      setForgotError(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className="container py-5">
      {loading && <LoadingOverlay />}
      <div className="auth-container shadow-lg rounded-3 overflow-hidden" style={{ maxWidth: 900, margin: '50px auto', background: '#fff' }}>
        <div className="row g-0" style={{ minHeight: 550 }}>
          <div className="col-md-5 d-flex flex-column justify-content-center align-items-center text-white" style={{ background: 'linear-gradient(to right, #2196F3, #1565C0)' }}>
            <h1 className="mb-3">{showForgot ? 'Password Recovery' : isSignIn ? 'Welcome Back!' : 'Welcome!'}</h1>
            <p className="mb-4">
              {showForgot
                ? 'Enter your email to receive a password reset link'
                : isSignIn
                  ? 'To keep connected with us please login with your personal info'
                  : 'Already have an account? Sign in to continue your journey with us'}
            </p>
            {!showForgot && (
              <button className="ghost-btn btn btn-outline-light" onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setIsSignIn(!isSignIn);
                  setSignInError(''); setSignUpError(''); setSignInSuccess(''); setSignUpSuccess('');
                  setLoading(false);
                }, 400);
              }}>
                {isSignIn ? 'Sign Up' : 'Sign In'}
              </button>
            )}
          </div>
          <div className="col-md-7 bg-white p-4">
            {showForgot ? (
              <form className="mx-auto" style={{ maxWidth: 400 }} onSubmit={handleForgot} noValidate>
                <h2 className="mb-4">Reset Password</h2>
                {forgotSuccess && <div className="alert alert-success">{forgotSuccess}</div>}
                {forgotError && <div className="alert alert-danger">{forgotError}</div>}
                <div className="mb-3">
                  <label htmlFor="forgotEmail" className="form-label">Email</label>
                  <input type="email" className="form-control" id="forgotEmail" required value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-3">Send Reset Link</button>
                <button type="button" className="btn btn-outline-secondary w-100" onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setShowForgot(false); setForgotEmail(''); setForgotSuccess(''); setForgotError('');
                    setLoading(false);
                  }, 400);
                }}>Back to Sign In</button>
              </form>
            ) : isSignIn ? (
              <form className="mx-auto" style={{ maxWidth: 400 }} onSubmit={handleSignIn} noValidate>
                <h2 className="mb-4">Sign In</h2>
                {signInSuccess && <div className="alert alert-success">{signInSuccess}</div>}
                {signInError && <div className="alert alert-danger">{signInError}</div>}
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email</label>
                  <input type="email" className="form-control" id="loginEmail" required value={signInData.email} onChange={e => setSignInData({ ...signInData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="loginPassword" required value={signInData.password} onChange={e => setSignInData({ ...signInData, password: e.target.value })} />
                </div>
                <div className="mb-3 text-end">
                  <button type="button" className="btn btn-link p-0" onClick={() => {
                    setLoading(true);
                    setTimeout(() => {
                      setShowForgot(true); setSignInError(''); setSignInSuccess('');
                      setLoading(false);
                    }, 400);
                  }}>Forgot your password?</button>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
              </form>
            ) : (
              <form className="mx-auto" style={{ maxWidth: 400 }} onSubmit={handleSignUp} noValidate>
                <h2 className="mb-4">Create Account</h2>
                {signUpSuccess && <div className="alert alert-success">{signUpSuccess}</div>}
                {signUpError && <div className="alert alert-danger">{signUpError}</div>}
                <div className="mb-3">
                  <label htmlFor="registerName" className="form-label">Name</label>
                  <input type="text" className="form-control" id="registerName" required value={signUpData.name} onChange={e => setSignUpData({ ...signUpData, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">Email</label>
                  <input type="email" className="form-control" id="registerEmail" required value={signUpData.email} onChange={e => setSignUpData({ ...signUpData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="registerPassword" required minLength={6} value={signUpData.password} onChange={e => setSignUpData({ ...signUpData, password: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password</label>
                  <input type="password" className="form-control" id="registerConfirmPassword" required value={signUpData.confirmPassword} onChange={e => setSignUpData({ ...signUpData, confirmPassword: e.target.value })} />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="termsCheck" checked={signUpData.terms} onChange={e => setSignUpData({ ...signUpData, terms: e.target.checked })} />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 