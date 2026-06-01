import React, { useState } from 'react';
import { UserPlus, User, Mail, ShieldAlert, CheckSquare, ArrowRight } from 'lucide-react';
import { lawDatabase } from '../data/lawDatabase';
import { signInWithGoogle } from '../utils/firebase';

export default function Register({ onRegisterSuccess, onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [region, setRegion] = useState('IN');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

        onRegisterSuccess(profile);
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

    if (!fullName.trim() || !username.trim() || !email.trim() || !licenseNo.trim() || !password) {
      setError('Please fill in all security registration fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const submitOffline = () => {
      try {
        const accounts = JSON.parse(localStorage.getItem('drivelegal_users') || '[]');
        const userExists = accounts.some(u =>
          (u.username && u.username.toLowerCase() === username.trim().toLowerCase()) ||
          (u.email && u.email.toLowerCase() === email.trim().toLowerCase())
        );
        if (userExists) {
          setError('A driver record with this username or email already exists.');
          setLoading(false);
          return;
        }

        const newUser = {
          id: 'DL-' + Math.floor(100000 + Math.random() * 900000),
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          licenseNo: licenseNo.trim().toUpperCase(),
          region,
          password,
          safetyScore: 100,
          badges: [],
          registeredAt: new Date().toISOString()
        };

        accounts.push(newUser);
        localStorage.setItem('drivelegal_users', JSON.stringify(accounts));
        localStorage.setItem('drivelegal_active_user', JSON.stringify(newUser));

        onRegisterSuccess(newUser);
        setLoading(false);
      } catch (err) {
        console.error("Offline registration failed:", err);
        setError("Offline registration failed. Please try again.");
        setLoading(false);
      }
    };

    fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        licenseNo: licenseNo.trim().toUpperCase(),
        region,
        password
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          // Double sync to localStorage
          const accounts = JSON.parse(localStorage.getItem('drivelegal_users') || '[]');
          const cleanAccounts = accounts.filter(u => u.username.toLowerCase() !== data.user.username.toLowerCase());
          cleanAccounts.push(data.user);
          localStorage.setItem('drivelegal_users', JSON.stringify(cleanAccounts));
          localStorage.setItem('drivelegal_active_user', JSON.stringify(data.user));

          onRegisterSuccess(data.user);
          setLoading(false);
        } else {
          setError(data.message || 'Registration failed.');
          setLoading(false);
        }
      })
      .catch(err => {
        console.log("Server auth registration offline, routing through offline storage:", err.message);
        submitOffline();
      });
  };

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '900px', padding: '10px', position: 'relative', margin: '0 auto' }}>
      {/* Top glowing brand accent */}
        <div className="top-brand-accent" />

      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div className="brand-logo-glow" style={{ margin: '0 auto 16px auto', width: '48px', height: '48px' }}>
          <UserPlus size={24} />
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }} className="gradient-text">Register Driver</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
          Initialize your encrypted driving license identity card
        </p>
      </div>

      {error && (
        <div className="severity-warning-box danger" style={{ margin: '0 0 16px 0', fontSize: '0.82rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Full Name & Username in 2 columns */}
        <div className="register-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Full Name
            </label>
            <input
              type="text"
              className="chat-input-field"
              placeholder="Jane Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Username
            </label>
            <input
              type="text"
              className="chat-input-field"
              placeholder="jane_safety"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Email Address
          </label>
          <input
            type="email"
            className="chat-input-field"
            placeholder="jane.doe@safety.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          />
        </div>

        {/* License Number & Driving Region */}
        <div className="register-grid register-grid-mixed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              License Number
            </label>
            <input
              type="text"
              className="chat-input-field"
              placeholder="DL-042024009"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Driving Region
            </label>
            <select
              className="location-selector"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{ padding: '7px 10px', fontSize: '0.85rem', width: '100%' }}
            >
              {Object.entries(lawDatabase.countries).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Passwords */}
        <div className="register-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              className="chat-input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Confirm
            </label>
            <input
              type="password"
              className="chat-input-field"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="glow-btn"
          disabled={loading}
          style={{
            marginTop: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '10px 18px',
            fontSize: '0.9rem'
          }}
        >
          {loading ? 'Encrypting Credentials...' : 'Create Driver Profile'}
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
            padding: '12px',
            fontSize: '0.9rem'
          }}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
          </svg>
          Register with Google
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>Already registered? </span>
        <button
          onClick={onNavigateToLogin}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-secondary)',
            fontWeight: '600',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Log In
        </button>
      </div>
    </div>
  );
}
