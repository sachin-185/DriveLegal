import React, { useState } from 'react';
import { lawDatabase } from '../data/lawDatabase';
import { Search, Filter, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

export default function ExplorerTab({ defaultLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // all or category key

  const countryCode = defaultLocation.country;
  const stateCode = defaultLocation.state;
  const countryData = lawDatabase.countries[countryCode] || lawDatabase.countries.IN;
  const states = countryData.states || {};

  // Compute active state factor
  const stateFactor = stateCode && states[stateCode] ? states[stateCode].factor : 1.0;
  const stateName = stateCode && states[stateCode] ? states[stateCode].name : '';

  // Get active lists of rules
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
    // Category match
    if (activeCategory !== 'all' && rule.categoryKey !== activeCategory) {
      return false;
    }
    
    // Search match
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
    <div>
      {/* Search Input Row */}
      <div className="explorer-search-bar">
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <Search 
            size={18} 
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} 
          />
          <input 
            type="text" 
            className="explorer-search-input" 
            placeholder={`Search statutory traffic rules in ${stateName || countryData.name}... (e.g. helmet, DUI, speeding)`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '48px' }}
          />
        </div>
      </div>

      {/* Category Chips Filters */}
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

      {/* Grid of Law Cards */}
      {filteredRules.length > 0 ? (
        <div className="laws-grid">
          {filteredRules.map((rule) => {
            let fine = rule.baseFine;
            let description = rule.description;
            let isOverridden = false;

            // Apply state overrides
            if (stateCode && rule.stateOverrides && rule.stateOverrides[stateCode]) {
              fine = rule.stateOverrides[stateCode].baseFine !== undefined ? rule.stateOverrides[stateCode].baseFine : fine;
              description = rule.stateOverrides[stateCode].description !== undefined ? rule.stateOverrides[stateCode].description : description;
              isOverridden = true;
            } else if (stateCode && stateFactor !== 1.0) {
              fine = Math.round(fine * stateFactor);
            }

            const isSevere = rule.points >= 6 || fine >= 5000 || rule.id.includes('dui') || rule.id.includes('drink');

            return (
              <div 
                key={rule.id} 
                className="glass-panel law-card" 
                style={{ 
                  borderColor: isSevere ? 'rgba(239, 68, 68, 0.15)' : 'var(--border-color)',
                  boxShadow: isSevere ? '0 4px 15px rgba(239, 68, 68, 0.04)' : 'var(--shadow-sm)'
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
                        Local Override
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
          <h2>No matching traffic codes found</h2>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            We couldn't locate any statutory laws matching "{searchQuery}". Try searching simple keywords like "speed", "license", or "helmet".
          </p>
        </div>
      )}
    </div>
  );
}
