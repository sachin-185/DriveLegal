import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle } from '../utils/firebase';

export default function Login({ onLoginSuccess, onNavigateToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setError('');
    setLoading(true);
    signInWithGoogle()
      .then((profile) => {
        const accounts = JSON.parse(localStorage.getItem('drivelegal_users') || '[]');
        const cleanAccounts = accounts.filter(u => u.username.toLowerCase() !== profile.username.toLowerCase());
        cleanAccounts.push(profile);
        localStorage.setItem('drivelegal_users', JSON.stringify(cleanAccounts));
        localStorage.setItem('drivelegal_active_user', JSON.stringify(profile));

        onLoginSuccess(profile);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Google Sign-In failed:", err);
        setError(err.message || "Google Sign-In failed. Please try again.");
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setLoading(true);

    const loginOffline = () => {
      try {
        const accounts = JSON.parse(localStorage.getItem('drivelegal_users') || '[]');
        const user = accounts.find(u => 
          (u.username && u.username.toLowerCase() === username.trim().toLowerCase()) || 
          (u.email && u.email.toLowerCase() === username.trim().toLowerCase())
        );

        if (!user) {
          setError('User record not found. Please click "Create an Account" below to register a profile first!');
          setLoading(false);
          return;
        }

        if (user.password !== password) {
          setError('Incorrect security password.');
          setLoading(false);
          return;
        }

        localStorage.setItem('drivelegal_active_user', JSON.stringify(user));
        onLoginSuccess(user);
        setLoading(false);
      } catch (err) {
        console.error("Offline login failed:", err);
        setError("Identity authorization failed. Please register a new account first.");
        setLoading(false);
      }
    };

    fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          // Sync database user to localStorage
          const accounts = JSON.parse(localStorage.getItem('drivelegal_users') || '[]');
          const cleanAccounts = accounts.filter(u => u.username.toLowerCase() !== data.user.username.toLowerCase());
          cleanAccounts.push(data.user);
          localStorage.setItem('drivelegal_users', JSON.stringify(cleanAccounts));
          localStorage.setItem('drivelegal_active_user', JSON.stringify(data.user));

          onLoginSuccess(data.user);
          setLoading(false);
        } else {
          setError(data.message || 'Identity authorization failed.');
          setLoading(false);
        }
      })
      .catch(err => {
        console.log("Server auth login offline, routing through offline storage:", err.message);
        loginOffline();
      });
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '32px', position: 'relative', margin: '0 auto' }}>
      {/* Top glowing brand accent */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: '4px',
        background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
        borderRadius: '0 0 8px 8px'
      }} />

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="brand-logo-glow" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px' }}>
          <Shield size={24} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }} className="gradient-text">Welcome Back</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
          Access your secure offline driving profile
        </p>
      </div>

      {error && (
        <div className="severity-warning-box danger" style={{ margin: '0 0 20px 0', fontSize: '0.82rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Username / Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Username or Email
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <User size={16} />
            </span>
            <input
              type="text"
              className="chat-input-field"
              placeholder="driver_safety"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Lock size={16} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              className="chat-input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '38px', paddingRight: '40px', width: '100%' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="glow-btn"
          disabled={loading}
          style={{
            marginTop: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%'
          }}
        >
          {loading ? 'Decrypting Profile...' : 'Authorize Login'}
          {!loading && <ArrowRight size={16} />}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0' }}>
          <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>Or</span>
          <div style={{ flexGrow: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <button
          type="button"
          className="glow-btn glow-btn-teal"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px'
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>First time on DriveLegal? </span>
        <button
          onClick={onNavigateToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-secondary)',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Create an Account
        </button>
      </div>
    </div>
  );
}
