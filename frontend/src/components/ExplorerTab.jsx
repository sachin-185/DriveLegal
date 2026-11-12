import React, { useState } from 'react';
import { lawDatabase } from '../data/lawDatabase';
import { tamilNaduRegulations } from '../data/tamilNaduRegulations';
import { 
  Search, ShieldAlert, ShieldCheck, HelpCircle, FileText, 
  Smartphone, TrafficCone, AlertTriangle, Info, CheckCircle2, 
  Car, Bike, ExternalLink, Calendar, CreditCard, Award
} from 'lucide-react';

export default function ExplorerTab({ defaultLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeView, setActiveView] = useState('fines_table'); // 'fines_table' | 'hsrp_guide' | 'key_rules' | 'statutory_codes'

  const countryCode = defaultLocation?.country || 'IN';
  const stateCode = defaultLocation?.state || 'TN';
  const countryData = lawDatabase.countries[countryCode] || lawDatabase.countries.IN;
  const states = countryData.states || {};
  const stateFactor = stateCode && states[stateCode] ? states[stateCode].factor : 1.0;
  const stateName = stateCode && states[stateCode] ? states[stateCode].name : 'Tamil Nadu';

  const { overview, keyRules, hsrpRegulations, hsrpProcurementGuide, finesTable } = tamilNaduRegulations;

  // Filter fines table based on search
  const filteredFines = finesTable.filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.violation.toLowerCase().includes(q) ||
      item.section.toLowerCase().includes(q) ||
      item.firstOffence.toLowerCase().includes(q) ||
      item.repeatOffence.toLowerCase().includes(q)
    );
  });

  // Filter statutory rules from lawDatabase
  const getAllRules = () => {
    const list = [];
    Object.entries(countryData.categories).forEach(([catKey, category]) => {
      category.rules.forEach(rule => {
        list.push({
          ...rule,
          categoryKey: catKey,
          categoryName: category.name
        });
      });
    });
    return list;
  };

  const filteredRules = getAllRules().filter(rule => {
    if (activeCategory !== 'all' && rule.categoryKey !== activeCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = rule.title.toLowerCase().includes(q);
      const matchDesc = rule.description.toLowerCase().includes(q);
      const matchSection = rule.section.toLowerCase().includes(q);
      const matchCat = rule.categoryName.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchSection || matchCat;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Official Tamil Nadu Regulations Hero Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderLeft: '4px solid var(--color-primary)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="law-citation-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                ACTIVE JURISDICTION: {stateName.toUpperCase()}
              </span>
              <span className="law-citation-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                AMENDED MOTOR VEHICLES ACT
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '4px 0 10px 0' }}>
              {overview.title}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.5', maxWidth: '950px' }}>
              {overview.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Sources Verified
            </span>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {overview.sources.map((s, idx) => (
                <span key={idx} style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 60-Day e-Challan Alert Strip */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <Calendar size={18} style={{ color: '#f87171', flexShrink: 0 }} />
          <div style={{ flexGrow: 1 }}>
            <span style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: '0.85rem' }}>
              CRITICAL NOTICE: 60-Day e-Challan Settlement Deadline
            </span>
            <p style={{ color: '#fecaca', fontSize: '0.8rem', margin: '2px 0 0 0' }}>
              Digital e-challans generated by Tamil Nadu ANPR cameras must be paid within 60 days. Defaulting leads to automatic Virtual Court summons, Vahan portal blacklisting, and Driving Licence disqualification.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`filter-chip ${activeView === 'fines_table' ? 'active' : ''}`}
          onClick={() => setActiveView('fines_table')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <CreditCard size={15} />
          <span>Fines & Penalties List</span>
        </button>

        <button
          className={`filter-chip ${activeView === 'hsrp_guide' ? 'active' : ''}`}
          onClick={() => setActiveView('hsrp_guide')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <Award size={15} />
          <span>HSRP Number Plate Guide</span>
        </button>

        <button
          className={`filter-chip ${activeView === 'key_rules' ? 'active' : ''}`}
          onClick={() => setActiveView('key_rules')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <ShieldCheck size={15} />
          <span>Key Traffic Rules</span>
        </button>

        <button
          className={`filter-chip ${activeView === 'statutory_codes' ? 'active' : ''}`}
          onClick={() => setActiveView('statutory_codes')}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}
        >
          <FileText size={15} />
          <span>All Statutory Sections</span>
        </button>
      </div>

      {/* Global Search Bar */}
      <div className="explorer-search-bar">
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="explorer-search-input"
            placeholder={
              activeView === 'fines_table' 
                ? "Search Tamil Nadu fines (e.g. helmet, non-HSRP, ambulance, drunk driving)..."
                : activeView === 'hsrp_guide'
                ? "Search HSRP guidelines, windshield stickers, snap-locks..."
                : "Search statutory traffic codes..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      {/* VIEW 1: Official Tamil Nadu Fines Table (Matching User's Uploaded Image) */}
      {activeView === 'fines_table' && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                List of Traffic & Number Plate Fines in Tamil Nadu
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
                Enforcement penalties compiled from Cars24, ICICI Lombard, and Tata AIG guidelines.
              </p>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: '600' }}>
              Showing {filteredFines.length} Violations
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Traffic Violation</th>
                <th style={{ padding: '12px 14px' }}>Statutory Section</th>
                <th style={{ padding: '12px 14px' }}>First Offence Fine</th>
                <th style={{ padding: '12px 14px' }}>Repeat Offence / Additional Penalty</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.map((row, idx) => {
                const isCritical = row.severity === 'critical';
                const isHigh = row.severity === 'high';
                return (
                  <tr 
                    key={row.id || idx}
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      background: idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '14px', fontWeight: '600', color: isCritical ? '#fca5a5' : '#ffffff' }}>
                      {row.violation}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="law-citation-badge" style={{ fontSize: '0.72rem' }}>
                        {row.section}
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontWeight: 'bold', color: 'var(--color-success)', fontSize: '0.95rem' }}>
                      {row.firstOffence}
                    </td>
                    <td style={{ padding: '14px', color: isCritical ? '#f87171' : isHigh ? '#fcd34d' : 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: isCritical ? '600' : 'normal' }}>
                      {row.repeatOffence}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: HSRP Number Plate Rules & Procurement Guide */}
      {activeView === 'hsrp_guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* HSRP MoRTH Standards Grid */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
              {hsrpRegulations.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '18px' }}>
              Enforced under standards formulated by the {hsrpRegulations.authority} (MoRTH).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {hsrpRegulations.standards.map((std, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--color-secondary)' }} />
                    <h3 style={{ fontSize: '0.92rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                      {std.feature}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                    {std.details}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual Color-Coded Number Plates */}
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginTop: '24px', marginBottom: '12px' }}>
              Color-Coded Number Plates by Vehicle Classification
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {hsrpRegulations.plateColorGuide.map((plate, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    backgroundColor: plate.plateBg,
                    color: plate.textColor,
                    border: `2px solid ${plate.border}`,
                    fontFamily: 'monospace',
                    fontWeight: '900',
                    fontSize: '1rem',
                    letterSpacing: '2px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    TN-01-AB-1234
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'white' }}>{plate.type}</span>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{plate.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Fuel Windshield Stickers */}
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginTop: '24px', marginBottom: '12px' }}>
              Fuel-Type Windshield Registration Stickers (Four-Wheelers)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {hsrpRegulations.stickerColorGuide.map((stk, idx) => (
                <div key={idx} style={{
                  padding: '12px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: stk.colorHex, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'white' }}>{stk.fuel}</span>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>{stk.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to Get HSRP in Tamil Nadu Guide */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '6px' }}>
              {hsrpProcurementGuide.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '20px' }}>
              {hsrpProcurementGuide.applicability}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {hsrpProcurementGuide.steps.map((st, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    {st.stepNumber}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                      {st.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45', margin: 0 }}>
                      {st.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Key Traffic Rules in Tamil Nadu */}
      {activeView === 'key_rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {keyRules.map((kr) => (
            <div key={kr.id} className="glass-panel law-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span className="law-citation-badge">{kr.legalBasis}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'white', margin: '0 0 6px 0' }}>
                {kr.title}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '12px' }}>
                {kr.description}
              </p>
              <div style={{ padding: '8px 12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                <span style={{ fontSize: '0.78rem', color: '#93c5fd', fontWeight: '500' }}>
                  📌 Rule Snapshot: {kr.shortSummary}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 4: All Statutory Sections (Original Search Grid) */}
      {activeView === 'statutory_codes' && (
        <div>
          <div className="category-filter-chips">
            <button
              className={`filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Violations
            </button>
            {Object.entries(countryData.categories).map(([catKey, category]) => (
              <button
                key={catKey}
                className={`filter-chip ${activeCategory === catKey ? 'active' : ''}`}
                onClick={() => setActiveCategory(catKey)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {filteredRules.length > 0 ? (
            <div className="laws-grid" style={{ marginTop: '16px' }}>
              {filteredRules.map((rule) => {
                let fine = rule.baseFine;
                let description = rule.description;
                let isOverridden = false;
                if (stateCode && rule.stateOverrides && rule.stateOverrides[stateCode]) {
                  fine = rule.stateOverrides[stateCode].baseFine !== undefined ? rule.stateOverrides[stateCode].baseFine : fine;
                  description = rule.stateOverrides[stateCode].description !== undefined ? rule.stateOverrides[stateCode].description : description;
                  isOverridden = true;
                } else if (stateCode && stateFactor !== 1.0) {
                  fine = Math.round(fine * stateFactor);
                }
                const isSevere = rule.points >= 6 || fine >= 5000 || rule.id.includes('dui') || rule.id.includes('drink') || rule.id.includes('juvenile') || rule.id.includes('ambulance');
                return (
                  <div
                    key={rule.id}
                    className="glass-panel law-card"
                    style={{
                      borderColor: isSevere ? 'rgba(239, 68, 68, 0.2)' : 'var(--border-color)',
                      boxShadow: isSevere ? '0 4px 15px rgba(239, 68, 68, 0.05)' : 'var(--shadow-sm)'
                    }}
                  >
                    <div>
                      <div className="law-header">
                        <h3 className="law-title-text" style={{ color: isSevere ? '#fca5a5' : '#ffffff' }}>
                          {rule.title}
                        </h3>
                        <span className="law-citation-badge">{rule.section}</span>
                      </div>
                      <p className="law-card-desc">{description}</p>
                    </div>
                    <div className="law-card-details-row">
                      <span className="law-card-fine">
                        {fine > 0 ? `${countryData.symbol}${fine.toLocaleString()}` : 'Court Appearance'}
                        {isOverridden && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', display: 'block', fontWeight: '500' }}>
                            Tamil Nadu Rate
                          </span>
                        )}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {rule.points > 0 && (
                          <span className="law-card-points">
                            +{rule.points} Demerits
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                          {rule.vehicleTypes.includes('all') ? 'All Vehicles' : rule.vehicleTypes.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
              <HelpCircle size={48} style={{ color: 'var(--color-primary)', opacity: 0.4, marginBottom: '16px' }} />
              <h2>No matching statutory codes found</h2>
              <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                We couldn't locate any statutory laws matching "{searchQuery}". Try searching keywords like "HSRP", "helmet", "ambulance", or "speed".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
