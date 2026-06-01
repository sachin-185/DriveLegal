import React, { useState, useEffect } from 'react';
import { MessageSquareCode, Calculator, BookOpen, GraduationCap, Flame, ShieldAlert, Wifi, Globe, User } from 'lucide-react';
import ChatbotTab from './components/ChatbotTab';
import CalculatorTab from './components/CalculatorTab';
import ExplorerTab from './components/ExplorerTab';
import QuizTab from './components/QuizTab';
import EmergencyTab from './components/EmergencyTab';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import { lawDatabase } from './data/lawDatabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('drivelegal_active_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState('chatbot');
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register'
  const [location, setLocation] = useState({ country: 'IN', state: 'DL' });
  const [offlineStatus, setOfflineStatus] = useState(true); // Default to visual offline success
  const [gpsStatusText, setGpsStatusText] = useState('Default Location');

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    // Align user active location to region selection upon log in
    const defaultState = user.region === 'IN' ? 'DL' : user.region === 'US' ? 'CA' : 'ENG';
    setLocation({ country: user.region || 'IN', state: defaultState });
    setActiveTab('chatbot'); // Default to chatbot upon successful authorization
  };

  const handleLogout = () => {
    localStorage.removeItem('drivelegal_active_user');
    setCurrentUser(null);
    setAuthScreen('login');
    setActiveTab('chatbot');
  };

  // Client-side Geo-Fencing Locator & Reverse Geocoding
  useEffect(() => {
    if ('geolocation' in navigator) {
      setGpsStatusText('Scanning GPS...');
      
      const runOfflineHeuristics = (lat, lon) => {
        let detectedCountry = 'IN';
        let detectedState = 'DL';

        // 1. Offline Geo-Fencing coordinate boundaries checks
        if (lat >= 8 && lat <= 38 && lon >= 68 && lon <= 98) {
          detectedCountry = 'IN';
          if (lat > 25 && lon < 79) detectedState = 'DL';
          else if (lat > 15 && lat < 21 && lon < 76) detectedState = 'MH';
          else if (lat > 8 && lat < 14 && lon > 77) detectedState = 'TN';
          else if (lat >= 11 && lat < 16 && lon >= 74 && lon < 79) detectedState = 'KA';
          else detectedState = 'MH';
          setGpsStatusText('GPS: India (Offline Est.)');
        } 
        // US boundaries
        else if (lat >= 24 && lat <= 50 && lon >= -125 && lon <= -66) {
          detectedCountry = 'US';
          if (lat >= 32 && lat <= 42 && lon <= -114) detectedState = 'CA';
          else if (lat >= 40 && lon >= -79 && lon <= -71) detectedState = 'NY';
          else if (lat <= 36 && lon >= -106 && lon <= -93) detectedState = 'TX';
          else detectedState = 'CA';
          setGpsStatusText('GPS: USA (Offline Est.)');
        } 
        // UK boundaries
        else if (lat >= 49 && lat <= 61 && lon >= -9 && lon <= 2) {
          detectedCountry = 'UK';
          if (lat > 55) detectedState = 'SCT';
          else if (lat <= 52.5 && lon > -0.5) detectedState = 'LDN';
          else detectedState = 'ENG';
          setGpsStatusText('GPS: UK (Offline Est.)');
        } else {
          // Timezone fallback
          const tzOffset = new Date().getTimezoneOffset();
          if (tzOffset === -330) {
            detectedCountry = 'IN';
            detectedState = 'DL';
            setGpsStatusText('TZ: India');
          } else if (tzOffset === 0) {
            detectedCountry = 'UK';
            detectedState = 'ENG';
            setGpsStatusText('TZ: UK');
          } else if (tzOffset >= 300 && tzOffset <= 480) {
            detectedCountry = 'US';
            detectedState = 'CA';
            setGpsStatusText('TZ: USA');
          } else {
            setGpsStatusText('Default: India');
          }
        }
        setLocation({ country: detectedCountry, state: detectedState });
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Call free reverse-geocoding API (Nominatim OpenStreetMap)
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
            headers: { 'Accept-Language': 'en' }
          })
            .then(res => res.json())
            .then(data => {
              if (data && data.address) {
                const cc = (data.address.country_code || '').toUpperCase();
                const stateName = (data.address.state || '').toLowerCase();
                const countyName = (data.address.county || '').toLowerCase();

                let countryCode = 'IN';
                let stateCode = 'DL';

                if (cc === 'IN') {
                  countryCode = 'IN';
                  if (stateName.includes('delhi')) stateCode = 'DL';
                  else if (stateName.includes('maharashtra')) stateCode = 'MH';
                  else if (stateName.includes('tamil nadu')) stateCode = 'TN';
                  else if (stateName.includes('karnataka')) stateCode = 'KA';
                  else if (stateName.includes('uttar pradesh')) stateCode = 'UP';
                  else stateCode = 'DL';
                  setGpsStatusText(`GPS: India (${data.address.state || 'Delhi'})`);
                } else if (cc === 'US') {
                  countryCode = 'US';
                  if (stateName.includes('california')) stateCode = 'CA';
                  else if (stateName.includes('new york')) stateCode = 'NY';
                  else if (stateName.includes('texas')) stateCode = 'TX';
                  else if (stateName.includes('florida')) stateCode = 'FL';
                  else stateCode = 'CA';
                  setGpsStatusText(`GPS: USA (${data.address.state || 'California'})`);
                } else if (cc === 'GB' || cc === 'UK') {
                  countryCode = 'UK';
                  if (stateName.includes('scotland')) stateCode = 'SCT';
                  else if (stateName.includes('london') || countyName.includes('london')) stateCode = 'LDN';
                  else stateCode = 'ENG';
                  setGpsStatusText(`GPS: UK (${data.address.state || 'England'})`);
                } else {
                  // Fallback to boundary checker for other coordinates
                  runOfflineHeuristics(latitude, longitude);
                  return;
                }

                setLocation({ country: countryCode, state: stateCode });
              } else {
                runOfflineHeuristics(latitude, longitude);
              }
            })
            .catch(err => {
              console.log("Nominatim reverse geocode failed, using offline heuristics:", err.message);
              runOfflineHeuristics(latitude, longitude);
            });
        },
        (error) => {
          console.log("GPS denied or unavailable, using timezone fallback:", error.message);
          
          // Timezone fallback
          const tzOffset = new Date().getTimezoneOffset();
          if (tzOffset === -330) {
            setLocation({ country: 'IN', state: 'DL' });
            setGpsStatusText('TZ: India');
          } else if (tzOffset === 0) {
            setLocation({ country: 'UK', state: 'ENG' });
            setGpsStatusText('TZ: UK');
          } else if (tzOffset >= 300 && tzOffset <= 480) {
            setLocation({ country: 'US', state: 'CA' });
            setGpsStatusText('TZ: USA');
          } else {
            setGpsStatusText('Default: India');
          }
        },
        { timeout: 8000 }
      );
    }
  }, []);

  // Monitor browser network states
  useEffect(() => {
    const handleOnline = () => setOfflineStatus(true); // Visual indicator: PWA still connected/cached
    const handleOffline = () => setOfflineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync state drops when modified in calculator or explorer
  const handleLocationChange = (newLoc) => {
    setLocation(newLoc);
  };

  const activeCountryData = lawDatabase.countries[location.country] || lawDatabase.countries.IN;
  const states = activeCountryData.states || {};

  const getPageTitle = () => {
    switch (activeTab) {
      case 'chatbot': return 'AI Legal Chatbot';
      case 'calculator': return 'Statutory Challan Calculator';
      case 'explorer': return 'Highway Law Explorer';
      case 'quiz': return 'Driving Safety Quiz';
      case 'emergency': return 'Emergency Assistance Center';
      case 'profile': return 'Driver Identity Dashboard';
      default: return 'DriveLegal Hub';
    }
  };

  if (!currentUser) {
    return (
      <div className="auth-gateway-immersive">
        <div className="auth-backdrop-decoration">
          <div className="auth-orb indigo"></div>
          <div className="auth-orb cyan"></div>
        </div>
        <div className="auth-card-wrapper">
          <div className="auth-branding-header">
            <div className="brand-logo-glow large">
              <svg viewBox="0 0 100 100" style={{ width: '32px', height: '32px', fill: 'none' }}>
                <path 
                  d="M50 5 C50 5 82 17 82 45 C82 67 50 85 50 85 C50 85 18 67 18 45 C18 17 50 5 50 5 Z" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeLinejoin="round" 
                />
                <line x1="33" y1="68" x2="47" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="67" y1="68" x2="53" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="50" y1="68" x2="50" y2="44" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
                
                <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="20" x2="50" y2="62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                
                <path d="M22 46 H38 C38 46 37 50 30 50 C23 50 22 46 22 46 Z" fill="currentColor" />
                <line x1="30" y1="30" x2="22" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="30" y1="30" x2="38" y2="46" stroke="currentColor" strokeWidth="2.5" />

                <path d="M62 46 H78 C78 46 77 50 70 50 C63 50 62 46 62 46 Z" fill="currentColor" />
                <line x1="70" y1="30" x2="62" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="70" y1="30" x2="78" y2="46" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginTop: '12px' }}>DriveLegal AI</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '6px' }}>
              Your Secure, Anti-Hallucination Road Compliance Companion
            </p>
          </div>
          
          <div className="auth-component-fade" style={{ width: '100%' }}>
            {authScreen === 'login' ? (
              <Login 
                onLoginSuccess={handleLoginSuccess} 
                onNavigateToRegister={() => setAuthScreen('register')} 
              />
            ) : (
              <Register 
                onRegisterSuccess={handleLoginSuccess} 
                onNavigateToLogin={() => setAuthScreen('login')} 
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Premium background mesh decoration orbs */}
      <div className="dashboard-backdrop-decoration">
        <div className="dashboard-orb violet"></div>
        <div className="dashboard-orb pink"></div>
      </div>
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div>
          {/* Logo brand section */}
          <div className="brand-section">
            <div className="brand-logo-glow">
              <svg viewBox="0 0 100 100" style={{ width: '22px', height: '22px', fill: 'none' }}>
                <path 
                  d="M50 5 C50 5 82 17 82 45 C82 67 50 85 50 85 C50 85 18 67 18 45 C18 17 50 5 50 5 Z" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeLinejoin="round" 
                />
                <line x1="33" y1="68" x2="47" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="67" y1="68" x2="53" y2="42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
                <line x1="50" y1="68" x2="50" y2="44" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" strokeLinecap="round" />
                
                <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                <line x1="50" y1="20" x2="50" y2="62" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                
                <path d="M22 46 H38 C38 46 37 50 30 50 C23 50 22 46 22 46 Z" fill="currentColor" />
                <line x1="30" y1="30" x2="22" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="30" y1="30" x2="38" y2="46" stroke="currentColor" strokeWidth="2.5" />

                <path d="M62 46 H78 C78 46 77 50 70 50 C63 50 62 46 62 46 Z" fill="currentColor" />
                <line x1="70" y1="30" x2="62" y2="46" stroke="currentColor" strokeWidth="2.5" />
                <line x1="70" y1="30" x2="78" y2="46" stroke="currentColor" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <h1 className="brand-name">DriveLegal</h1>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                AI Road Safety Hub
              </span>
            </div>
          </div>

          {/* Nav buttons */}
          <nav className="navigation-links">
            <div 
              className={`nav-item ${activeTab === 'chatbot' ? 'active' : ''}`}
              onClick={() => setActiveTab('chatbot')}
            >
              <MessageSquareCode size={18} />
              <span>AI Chatbot</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <Calculator size={18} />
              <span>Challan Calculator</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'explorer' ? 'active' : ''}`}
              onClick={() => setActiveTab('explorer')}
            >
              <BookOpen size={18} />
              <span>Law Explorer</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <GraduationCap size={18} />
              <span>Safety Quiz</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'emergency' ? 'active' : ''}`}
              onClick={() => setActiveTab('emergency')}
            >
              <ShieldAlert size={18} />
              <span>Emergency Services</span>
            </div>

            <div 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Driver Profile</span>
            </div>
          </nav>
        </div>

        {/* Global location cards */}
        <div className="sidebar-footer">
          <div className="location-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="location-title">ACTIVE LOCATION</span>
              <Globe size={12} style={{ color: 'var(--color-secondary)' }} />
            </div>
            
            <select 
              className="location-selector"
              value={location.country}
              onChange={(e) => setLocation({ country: e.target.value, state: Object.keys(lawDatabase.countries[e.target.value].states || {})[0] || '' })}
            >
              {Object.entries(lawDatabase.countries).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>

            {Object.keys(states).length > 0 && (
              <select 
                className="location-selector"
                value={location.state}
                onChange={(e) => setLocation({ ...location, state: e.target.value })}
                style={{ marginTop: '4px' }}
              >
                {Object.entries(states).map(([code, s]) => (
                  <option key={code} value={code}>{s.name}</option>
                ))}
              </select>
            )}
            
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '2px' }}>
              {gpsStatusText}
            </span>
          </div>

          {/* Secure Driver Profile Badge */}
          {currentUser && (
            <div className="location-card" style={{ marginTop: '8px', border: '1px solid rgba(139, 92, 246, 0.25)', display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', flexShrink: 0 }}>
                {currentUser.fullName ? currentUser.fullName.split(' ').map(n => n[0]).join('') : 'U'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.fullName}
                </span>
                <span style={{ fontSize: '0.6rem', color: 'var(--color-success)', fontWeight: '600' }}>
                  🔒 SECURE IDENTITY
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="main-content">
        {/* Top Header bar */}
        <header className="top-bar">
          <div className="top-bar-title">
            <h1 className="gradient-text">{getPageTitle()}</h1>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {/* Status indicator badges */}
            <div className={`offline-badge ${offlineStatus ? '' : 'disconnected'}`}>
              <div className="offline-dot"></div>
              <span>{offlineStatus ? 'Offline Resilient PWA' : 'Low Connection Mode'}</span>
            </div>
          </div>
        </header>

        {/* Tab content frames */}
        <section className="tab-content-area">
          {activeTab === 'chatbot' && (
            <ChatbotTab defaultLocation={location} />
          )}

          {activeTab === 'calculator' && (
            <CalculatorTab 
              defaultLocation={location} 
              onLocationChange={handleLocationChange} 
            />
          )}

          {activeTab === 'explorer' && (
            <ExplorerTab defaultLocation={location} />
          )}

          {activeTab === 'quiz' && (
            <QuizTab />
          )}

          {activeTab === 'emergency' && (
            <EmergencyTab defaultLocation={location} />
          )}

          {activeTab === 'profile' && currentUser && (
            <Profile user={currentUser} onLogout={handleLogout} />
          )}
        </section>
      </main>
    </div>
  );
}
