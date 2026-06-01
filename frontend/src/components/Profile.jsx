import React, { useState, useEffect } from 'react';
import { Award, LogOut, Shield, MapPin, Calendar, CreditCard, Star, Activity, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Profile({ user, onLogout }) {
  const [safetyScore, setSafetyScore] = useState(user.safetyScore || 100);
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  // Load live stats & badges from localStorage
  useEffect(() => {
    // 1. Fetch active user details
    const active = JSON.parse(localStorage.getItem('drivelegal_active_user'));
    if (active) {
      setSafetyScore(active.safetyScore || 100);
    }

    // 2. Scan localStorage for unlocked badges from quiz sessions
    const scoreState = JSON.parse(localStorage.getItem('quiz_completed_badges')) || [];
    setUnlockedBadges(scoreState);
  }, [user]);

  const handleManualBadgeUnlock = () => {
    // Hidden egg for safety auditors!
    confetti({
      particleCount: 120,
      spread: 90,
      colors: ['#a5b4fc', '#6366f1', '#06b6d4']
    });
  };

  const getRegionName = (code) => {
    switch (code) {
      case 'IN': return 'India (MVA)';
      case 'US': return 'United States (CVC/VTL)';
      case 'UK': return 'United Kingdom (Highway Code)';
      default: return code;
    }
  };

  const getSafetyStanding = (score) => {
    if (score >= 90) return { label: 'Elite Operator', color: 'var(--color-success)', bg: 'var(--color-success-bg)' };
    if (score >= 70) return { label: 'Defensive Driver', color: 'var(--color-primary)', bg: 'var(--color-primary-glow)' };
    if (score >= 50) return { label: 'Cautionary Review', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' };
    return { label: 'Suspension Warning', color: 'var(--color-danger)', bg: 'var(--color-danger-bg)' };
  };

  const standing = getSafetyStanding(safetyScore);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      {/* LEFT COLUMN: LICENSE & STATS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Virtual Smart Driving License Card */}
        <div className="glass-panel" style={{
          position: 'relative',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.45) 0%, rgba(8, 12, 24, 0.75) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), var(--shadow-glow)',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          {/* Decorative glowing background gradients */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* License Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 'bold' }}>
                Unified Digital Identity
              </h3>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginTop: '2px', letterSpacing: '0.02em' }}>
                DRIVING LICENSE
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.62rem', background: standing.bg, color: standing.color, border: `1px solid ${standing.color}40`, padding: '4px 8px', borderRadius: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {standing.label}
              </span>
              <CreditCard size={18} style={{ color: 'var(--color-primary)' }} />
            </div>
          </div>

          {/* Card Body */}
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center' }}>
            {/* Mock Portrait Avatar */}
            <div style={{
              width: '90px',
              height: '110px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Shield size={32} style={{ color: 'var(--color-primary)', opacity: '0.5' }} />
              <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                background: 'rgba(99, 102, 241, 0.25)',
                textAlign: 'center',
                padding: '2px 0',
                fontSize: '0.58rem',
                fontWeight: 'bold',
                color: 'white',
                letterSpacing: '0.05em'
              }}>
                VERIFIED
              </div>
            </div>

            {/* License Details Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</span>
                <strong style={{ color: '#ffffff' }}>{user.fullName}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>License No.</span>
                  <strong style={{ fontFamily: 'monospace', color: 'var(--color-secondary)' }}>{user.licenseNo}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Authority Jurisdiction</span>
                  <strong style={{ color: '#ffffff' }}>{getRegionName(user.region)}</strong>
                </div>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Since</span>
                <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  <Calendar size={12} />
                  {new Date(user.registeredAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Smartcard Chip & Barcode Visuals */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100px' }}>
              {/* Gold Chip */}
              <div style={{
                width: '32px',
                height: '24px',
                background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                borderRadius: '4px',
                border: '1px solid #a16207',
                position: 'relative',
                boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.3)'
              }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(0,0,0,0.15)' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(0,0,0,0.15)' }} />
              </div>
              
              {/* Barcode representation */}
              <div style={{ display: 'flex', gap: '2px', background: '#ffffff', padding: '4px 6px', borderRadius: '4px', opacity: 0.85 }}>
                <div style={{ width: '1px', height: '24px', background: '#000' }} />
                <div style={{ width: '2px', height: '24px', background: '#000' }} />
                <div style={{ width: '1px', height: '24px', background: '#000' }} />
                <div style={{ width: '3px', height: '24px', background: '#000' }} />
                <div style={{ width: '1px', height: '24px', background: '#000' }} />
                <div style={{ width: '2px', height: '24px', background: '#000' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Safety Logs info */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.05rem', borderLeft: '3px solid var(--color-primary)', paddingLeft: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: 'var(--color-primary)' }} />
            Safety Score & Legal Audit Record
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="stat-item" style={{ padding: '12px' }}>
              <span className="stat-val" style={{ color: standing.color }}>{safetyScore}</span>
              <span className="stat-lbl">Safety Index Rating</span>
            </div>
            <div className="stat-item" style={{ padding: '12px' }}>
              <span className="stat-val">{unlockedBadges.length}</span>
              <span className="stat-lbl">Quiz Collectibles</span>
            </div>
            <div className="stat-item" style={{ padding: '12px' }}>
              <span className="stat-val" style={{ color: 'var(--color-secondary)' }}>0</span>
              <span className="stat-lbl">Demerit Violations</span>
            </div>
          </div>

          <div className="severity-warning-box safe" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Shield size={20} />
            <div>
              <strong>No pending challans!</strong> Your record is completely clear. Keep practicing defensive driving protocols to maintain your safety discount factors.
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: CLOSET & ACTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Badges Locker */}
        <div className="glass-panel" style={{ padding: '24px', flexGrow: 1 }}>
          <h2 className="receipt-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }} onClick={handleManualBadgeUnlock}>
            <Award size={14} style={{ color: 'var(--color-secondary)' }} />
            Badges Closet
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Novice Driver Badge */}
            <div className={`badge-card ${unlockedBadges.includes('novice') ? 'unlocked' : ''}`} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', textAlign: 'left' }}>
              <div className="badge-icon" style={{ flexShrink: 0 }}>
                <Star size={16} fill={unlockedBadges.includes('novice') ? "var(--color-secondary)" : "none"} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '0.82rem', color: unlockedBadges.includes('novice') ? 'white' : 'var(--text-secondary)' }}>Novice Driver</strong>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Score 1+ point in safety quiz</span>
              </div>
            </div>

            {/* Law-Abiding Citizen Badge */}
            <div className={`badge-card ${unlockedBadges.includes('citizen') ? 'unlocked' : ''}`} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', textAlign: 'left' }}>
              <div className="badge-icon" style={{ flexShrink: 0 }}>
                <Star size={16} fill={unlockedBadges.includes('citizen') ? "var(--color-secondary)" : "none"} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '0.82rem', color: unlockedBadges.includes('citizen') ? 'white' : 'var(--text-secondary)' }}>Law-Abiding Citizen</strong>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Score 3+ points in safety quiz</span>
              </div>
            </div>

            {/* Road Safety Champion Badge */}
            <div className={`badge-card ${unlockedBadges.includes('champion') ? 'unlocked' : ''}`} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px', textAlign: 'left' }}>
              <div className="badge-icon" style={{ flexShrink: 0 }}>
                <Star size={16} fill={unlockedBadges.includes('champion') ? "var(--color-secondary)" : "none"} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ fontSize: '0.82rem', color: unlockedBadges.includes('champion') ? 'white' : 'var(--text-secondary)' }}>Safety Champion</strong>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Score 5/5 perfect quiz streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Account settings log out card */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            className="glow-btn"
            onClick={onLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: 'var(--color-danger)',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '10px 14px',
              fontSize: '0.85rem'
            }}
          >
            <LogOut size={16} />
            Revoke Access Authorization
          </button>
        </div>
      </div>
    </div>
  );
}
