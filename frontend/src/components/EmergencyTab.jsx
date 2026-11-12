import React from 'react';
import { lawDatabase } from '../data/lawDatabase';
import { ShieldAlert, HeartPulse, ShieldCheck, Truck, PhoneCall, LifeBuoy, MapPin } from 'lucide-react';

export default function EmergencyTab({ defaultLocation }) {
  const countryCode = defaultLocation?.country || 'IN';
  const stateCode = defaultLocation?.state || 'TN';
  const countryData = lawDatabase.countries[countryCode] || lawDatabase.countries.IN;
  const states = countryData.states || {};
  const emergencyInfo = stateCode && states[stateCode]?.emergency ? states[stateCode].emergency : countryData.defaultEmergency;
  const stateLabel = stateCode && states[stateCode] ? states[stateCode].name : 'Tamil Nadu';

  const directoryData = [
    {
      state: "Delhi",
      police: "112, 100",
      ambulance: "102, 108, 112",
      highway: "1033 (NHAI), 1095 (Delhi Traffic)",
      fire: "101, 112"
    },
    {
      state: "Maharashtra",
      police: "112, 100",
      ambulance: "108, 102, 112",
      highway: "1033 (NHAI), 9833498334 (Highway Police)",
      fire: "101, 112"
    },
    {
      state: "Tamil Nadu",
      police: "112, 100, 103 (Traffic)",
      ambulance: "108",
      highway: "1033 (NHAI), 1073 (Road Accident)",
      fire: "101, 112"
    },
    {
      state: "Karnataka",
      police: "112, 100",
      ambulance: "102",
      highway: "1033 (NHAI), 1073 (Road Accident)",
      fire: "101, 112"
    },
    {
      state: "Uttar Pradesh",
      police: "112, 100",
      ambulance: "112",
      highway: "1033 (NHAI), 1073 (Road Accident)",
      fire: "101, 112"
    }
  ];

  return (
    <div className="emergency-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="glass-panel emergency-list-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h2 className="calc-section-title" style={{ fontSize: '1.4rem', margin: 0 }}>
              Roadside Emergency Hotlines ({stateLabel})
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '6px' }}>
              Official statutory emergency contacts. Call these numbers immediately during traffic accidents, breakdowns, or medical crises.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 14px', borderRadius: '20px', color: 'var(--color-danger)', fontSize: '0.82rem', fontWeight: 600 }}>
            <PhoneCall size={15} />
            <span>24/7 Priority Emergency Access</span>
          </div>
        </div>

        {/* 4 Core Hotline Cards for Currently Selected State */}
        <div className="hotline-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          <div className="glass-panel hotline-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #6366f1' }}>
            <div className="hotline-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '12px', borderRadius: '12px' }}>
              <ShieldAlert size={28} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Police / Law Enforcement</span>
              <span className="hotline-number" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '0.03em', display: 'block', marginTop: '4px' }}>{emergencyInfo.police}</span>
            </div>
          </div>

          <div className="glass-panel hotline-card medical" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #10b981' }}>
            <div className="hotline-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '12px', borderRadius: '12px' }}>
              <HeartPulse size={28} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ambulance / Medical</span>
              <span className="hotline-number" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '0.03em', display: 'block', marginTop: '4px' }}>{emergencyInfo.ambulance}</span>
            </div>
          </div>

          <div className="glass-panel hotline-card highway" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #f59e0b' }}>
            <div className="hotline-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '12px', borderRadius: '12px' }}>
              <Truck size={28} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Highway Patrol Assistance</span>
              <span className="hotline-number" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '0.03em', display: 'block', marginTop: '4px' }}>{emergencyInfo.highwayPatrol}</span>
            </div>
          </div>

          <div className="glass-panel hotline-card fire" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #ef4444' }}>
            <div className="hotline-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '12px', borderRadius: '12px' }}>
              <ShieldCheck size={28} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Emergency Fire Brigade</span>
              <span className="hotline-number" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', letterSpacing: '0.03em', display: 'block', marginTop: '4px' }}>{emergencyInfo.fire || '101, 112'}</span>
            </div>
          </div>
        </div>

        {/* State / UT Statutory Emergency Directory Table (Exact Image 4 Match) */}
        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.6)', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}>
            <MapPin size={18} style={{ color: 'var(--color-secondary)' }} />
            National Road Safety Emergency Directory (State-Wise Matrix)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>State / UT</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Police / Law Enforcement</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Ambulance / Medical</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Highway Patrol Assistance</th>
                  <th style={{ padding: '12px 14px', fontWeight: 600 }}>Emergency Fire Brigade</th>
                </tr>
              </thead>
              <tbody>
                {directoryData.map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    background: row.state.toLowerCase() === stateLabel.toLowerCase() ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}>
                    <td style={{ padding: '14px', fontWeight: 700, color: '#ffffff', textDecoration: 'underline dotted', textUnderlineOffset: '4px' }}>
                      {row.state}
                    </td>
                    <td style={{ padding: '14px', color: '#e2e8f0', fontWeight: 600 }}>
                      {row.police}
                    </td>
                    <td style={{ padding: '14px', color: '#e2e8f0' }}>
                      {row.ambulance}
                    </td>
                    <td style={{ padding: '14px', color: '#e2e8f0' }}>
                      {row.highway}
                    </td>
                    <td style={{ padding: '14px', color: '#e2e8f0' }}>
                      {row.fire}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Step-by-Step Breakdown Safety Timeline */}
        <div className="glass-panel incident-steps-panel" style={{ padding: '20px', background: 'rgba(15, 23, 42, 0.5)' }}>
          <h3 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LifeBuoy size={18} style={{ color: 'var(--color-secondary)' }} />
            Statutory Breakdown & Incident Safety Timeline
          </h3>
          <div className="workflow-steps-list">
            <div className="workflow-step active">
              <div className="step-num-badge">1</div>
              <div className="step-content">
                <span className="step-title">Secure & Stabilize Vehicle</span>
                <span className="step-desc">Pull over safely onto the hard shoulder or nearest curb. Turn your steering wheel away from the active lane, set the handbrake, and immediately switch on hazard lights.</span>
              </div>
            </div>

            <div className="workflow-step active">
              <div className="step-num-badge">2</div>
              <div className="step-content">
                <span className="step-title">Examine Surrounding Safety Zones</span>
                <span className="step-desc">Always check surrounding traffic before exiting. Passengers must exit from the side facing away from moving traffic and move behind crash barriers.</span>
              </div>
            </div>

            <div className="workflow-step active">
              <div className="step-num-badge">3</div>
              <div className="step-content">
                <span className="step-title">Deploy Reflective Warning Triangle</span>
                <span className="step-desc">Place your reflective triangle at least 45 to 50 meters (150 feet) behind the stationary vehicle to alert high-speed oncoming traffic.</span>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-num-badge">4</div>
              <div className="step-content">
                <span className="step-title">Contact Highway Hotline</span>
                <span className="step-desc">Dial the dedicated highway patrol number above. Provide your landmark, direction of travel, and lane position. Never attempt self-repair on active lanes.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
