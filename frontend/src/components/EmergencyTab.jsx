import React from 'react';
import { lawDatabase } from '../data/lawDatabase';
import { Phone, ShieldAlert, HeartPulse, ShieldCheck, AlertTriangle, Compass, MapPin, Truck } from 'lucide-react';

export default function EmergencyTab({ defaultLocation }) {
  const countryCode = defaultLocation.country;
  const stateCode = defaultLocation.state;
  const countryData = lawDatabase.countries[countryCode] || lawDatabase.countries.IN;
  const states = countryData.states || {};

  const emergencyInfo = stateCode && states[stateCode]?.emergency 
    ? states[stateCode].emergency 
    : countryData.defaultEmergency;

  const stateLabel = stateCode && states[stateCode] ? states[stateCode].name : '';

  // IIT Madras CoERS Rbglabs GPS coordinates for that premium hackathon nod!
  const hackathonCoordinates = {
    lat: "13.0063° N",
    lng: "80.2404° E",
    desc: "CoERS Labs, IIT Madras"
  };

  return (
    <div className="emergency-grid">
      {/* LEFT LIST PANEL */}
      <div className="glass-panel emergency-list-panel">
        <h2 className="calc-section-title">
          Roadside Emergency Centers ({stateLabel || countryData.name})
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
          Statutory roadside hotlines and emergency contact listings. Keep these in mind while traveling in low-network regions.
        </p>

        {/* Hotlines Grid */}
        <div className="hotline-cards-grid">
          <div className="glass-panel hotline-card">
            <div className="hotline-icon">
              <ShieldAlert size={24} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title">Police (Law Enforcement)</span>
              <span className="hotline-number">{emergencyInfo.police}</span>
            </div>
          </div>

          <div className="glass-panel hotline-card medical">
            <div className="hotline-icon">
              <HeartPulse size={24} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title">Medical / Ambulance Services</span>
              <span className="hotline-number">{emergencyInfo.ambulance}</span>
            </div>
          </div>

          <div className="glass-panel hotline-card highway">
            <div className="hotline-icon">
              <Truck size={24} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title">National Highway Patrol</span>
              <span className="hotline-number">{emergencyInfo.highwayPatrol}</span>
            </div>
          </div>

          <div className="glass-panel hotline-card fire">
            <div className="hotline-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="hotline-info">
              <span className="hotline-title">Emergency Fire Brigade</span>
              <span className="hotline-number">{emergencyInfo.fire || '112'}</span>
            </div>
          </div>
        </div>

        {/* Breakdown workflow checklist */}
        <div className="glass-panel incident-steps-panel">
          <h2 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
            Statutory Breakdown Safety Timeline
          </h2>
          
          <div className="workflow-steps-list">
            <div className="workflow-step active">
              <div className="step-num-badge">1</div>
              <div className="step-content">
                <span className="step-title">Secure & Stabilize Vehicle</span>
                <span className="step-desc">Pull over safely onto the hard shoulder or roadside. Turn the steering wheel away from the active lane, set the parking brake, and immediately activate your hazard warning lights.</span>
              </div>
            </div>

            <div className="workflow-step active">
              <div className="step-num-badge">2</div>
              <div className="step-content">
                <span className="step-title">Examine Surrounding Safety Zones</span>
                <span className="step-desc">Check traffic before exiting the vehicle. Passengers should exit on the left side (or side facing away from active traffic lanes) and stand behind highway crash barriers.</span>
              </div>
            </div>

            <div className="workflow-step active">
              <div className="step-num-badge">3</div>
              <div className="step-content">
                <span className="step-title">Deploy Warnings (Reflective Triangle)</span>
                <span className="step-desc">Deploy a reflective warning triangle approximately 50 meters (150 feet) behind the vehicle to give incoming traffic ample stopping alert notice.</span>
              </div>
            </div>

            <div className="workflow-step">
              <div className="step-num-badge">4</div>
              <div className="step-content">
                <span className="step-title">Trigger Highway Hotlines</span>
                <span className="step-desc">Call the roadside emergency numbers above, providing your exact coordinates. Do not attempt self-repair on active, high-speed highway corridors.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT BEACON MAP PANEL */}
      <div className="glass-panel simulated-map-widget">
        <h2 className="receipt-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={14} style={{ color: 'var(--color-secondary)' }} />
          Local Emergency Locator (Offline)
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
          GPS locator operates 100% offline, caching nearby emergency stations via cached static grids.
        </p>

        {/* Visual Map Viewport */}
        <div className="map-viewport">
          {/* Subtle grid lines background overlay */}
          <svg className="grid-line-svg">
            <defs>
              <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)"/>
          </svg>

          {/* Compass Radar circular bands */}
          <div style={{ position: 'absolute', width: '220px', height: '220px', border: '1px dashed rgba(6, 182, 212, 0.15)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', width: '130px', height: '130px', border: '1px dashed rgba(6, 182, 212, 0.25)', borderRadius: '50%' }}></div>

          {/* User broken car beacon */}
          <div className="simulated-car-beacon">
            <div className="ping-beacon"></div>
            <MapPin className="car-icon" size={32} />
          </div>

          {/* Simulated landmarks nearby */}
          <div className="hospital-landmark" title="IIT Madras Trauma Medical Center">
            <HeartPulse size={20} />
            <span style={{ fontSize: '0.62rem', display: 'block', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', marginTop: '2px', whiteSpace: 'nowrap' }}>
              IIT Medical (1.2 km)
            </span>
          </div>

          <div className="police-landmark" title="CoERS Highway Patrol Station">
            <ShieldAlert size={20} />
            <span style={{ fontSize: '0.62rem', display: 'block', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px', marginTop: '2px', whiteSpace: 'nowrap' }}>
              Patrol Station (2.5 km)
            </span>
          </div>

          {/* Active coordinates overlays */}
          <div className="gps-info-overlay">
            <div>
              <div style={{ fontWeight: 'bold', color: 'white' }}>Current Location Node</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{hackathonCoordinates.desc}</div>
            </div>
            <div className="coordinates" style={{ textAlign: 'right' }}>
              <div>{hackathonCoordinates.lat}</div>
              <div>{hackathonCoordinates.lng}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
