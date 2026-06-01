import React, { useState, useEffect } from 'react';
import { lawDatabase } from '../data/lawDatabase';
import { Bike, Car, Truck, Printer, AlertTriangle, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export default function CalculatorTab({ defaultLocation, onLocationChange }) {
  const [countryCode, setCountryCode] = useState(defaultLocation.country);
  const [stateCode, setStateCode] = useState(defaultLocation.state || '');
  const [vehicleType, setVehicleType] = useState('car'); // car, motorcycle, commercial
  const [selectedViolations, setSelectedViolations] = useState({});
  const [totalFine, setTotalFine] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [activeCategory, setActiveCategory] = useState('');

  const countryData = lawDatabase.countries[countryCode] || lawDatabase.countries.IN;
  const states = countryData.states || {};

  // Sync state drops when country changes
  useEffect(() => {
    const availableStates = Object.keys(states);
    if (availableStates.length > 0) {
      // Find matching state or default to first
      const defaultState = availableStates.includes(defaultLocation.state)
        ? defaultLocation.state
        : availableStates[0];
      setStateCode(defaultState);
    } else {
      setStateCode('');
    }
    setSelectedViolations({}); // Clear selected violations
  }, [countryCode]);

  // Handle location update up
  useEffect(() => {
    onLocationChange({ country: countryCode, state: stateCode });
  }, [countryCode, stateCode]);

  // Recalculate totals
  useEffect(() => {
    let fineSum = 0;
    let pointsSum = 0;

    Object.entries(selectedViolations).forEach(([ruleId, checked]) => {
      if (!checked) return;
      let foundRule = null;
      for (const category of Object.values(countryData.categories)) {
        const rule = category.rules.find(r => r.id === ruleId);
        if (rule) {
          foundRule = rule;
          break;
        }
      }

      if (foundRule) {
        let fine = foundRule.baseFine;
        if (stateCode && foundRule.stateOverrides && foundRule.stateOverrides[stateCode]) {
          fine = foundRule.stateOverrides[stateCode].baseFine !== undefined
            ? foundRule.stateOverrides[stateCode].baseFine
            : fine;
        } else if (stateCode && states[stateCode]) {
          const factor = states[stateCode].factor || 1.0;
          fine = Math.round(fine * factor);
        }

        fineSum += fine;
        pointsSum += foundRule.points || 0;
      }
    });

    setTotalFine(fineSum);
    setTotalPoints(pointsSum);
  }, [selectedViolations, countryCode, stateCode, vehicleType]);

  const handleCheckboxChange = (ruleId, isChecked) => {
    setSelectedViolations(prev => ({
      ...prev,
      [ruleId]: isChecked
    }));
  };

  const handleReset = () => {
    setSelectedViolations({});
    setTotalFine(0);
    setTotalPoints(0);
  };

  const printReceipt = () => {
    const symbol = countryData.symbol;
    const vehicleLabel = vehicleType === 'car' ? 'Light Motor Vehicle (Car)' : vehicleType === 'motorcycle' ? 'Two-Wheeler (Motorcycle/Scooter)' : 'Medium/Heavy Commercial (Truck/Bus)';

    // Assemble receipts content
    let receiptContent = `
      <html>
        <head>
          <title>DriveLegal Citation Estimate Summary</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #111; padding: 20px; max-width: 600px; margin: 0 auto; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { font-size: 20px; margin: 0 0 5px 0; }
            .meta-row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th { border-bottom: 1px solid #333; text-align: left; font-size: 13px; padding-bottom: 8px; }
            .table td { padding: 8px 0; font-size: 12px; vertical-align: top; }
            .total-section { border-top: 2px dashed #333; padding-top: 15px; margin-top: 15px; font-weight: bold; }
            .total-row { display: flex; justify-content: space-between; font-size: 15px; margin-bottom: 6px; }
            .disclaimer { font-size: 10px; text-align: center; color: #555; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="header">
            <h1>DRIVELEGAL STATUTORY ROAD SAFETY SYSTEM</h1>
            <div>ESTIMATED COMPENSATORY CHALLAN RECEIPT</div>
          </div>
          
          <div class="meta-row">
            <span><strong>Date:</strong> ${new Date().toLocaleDateString()}</span>
            <span><strong>Country:</strong> ${countryData.name}</span>
          </div>
          <div class="meta-row">
            <span><strong>Jurisdiction:</strong> ${stateCode ? states[stateCode].name : 'Federal/National'}</span>
            <span><strong>Vehicle Class:</strong> ${vehicleLabel}</span>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th width="70%">VIOLATION DETAILS & CITATION</th>
                <th width="30%" style="text-align: right;">COMPENSATION</th>
              </tr>
            </thead>
            <tbody>
    `;

    let itemAdded = false;
    Object.entries(selectedViolations).forEach(([ruleId, checked]) => {
      if (!checked) return;

      let foundRule = null;
      for (const category of Object.values(countryData.categories)) {
        const rule = category.rules.find(r => r.id === ruleId);
        if (rule) {
          foundRule = rule;
          break;
        }
      }

      if (foundRule) {
        let fine = foundRule.baseFine;
        if (stateCode && foundRule.stateOverrides && foundRule.stateOverrides[stateCode]) {
          fine = foundRule.stateOverrides[stateCode].baseFine !== undefined ? foundRule.stateOverrides[stateCode].baseFine : fine;
        } else if (stateCode && states[stateCode]) {
          fine = Math.round(fine * states[stateCode].factor);
        }

        receiptContent += `
          <tr>
            <td>
              <strong>${foundRule.title}</strong><br/>
              <small>${foundRule.section}</small><br/>
              ${foundRule.points > 0 ? `<small>Demerits: ${foundRule.points} Points</small>` : ''}
            </td>
            <td style="text-align: right; font-weight: bold;">${symbol}${fine.toLocaleString()}</td>
          </tr>
        `;
        itemAdded = true;
      }
    });

    if (!itemAdded) {
      receiptContent += `<tr><td colspan="2" style="text-align:center;">No active infractions selected. Safe driving record!</td></tr>`;
    }

    receiptContent += `
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>ESTIMATED SUM FINE:</span>
              <span>${symbol}${totalFine.toLocaleString()}</span>
            </div>
            <div class="total-row" style="color: #c2410c;">
              <span>DEMERIT POINTS DEDUCTION:</span>
              <span>${totalPoints} Points</span>
            </div>
          </div>
          
          <div class="disclaimer">
            This document represents a dynamic computational estimate calculated by DriveLegal completely offline. 
            Citations depend on statutory frameworks (such as the Motor Vehicles Act or state amendments). 
            DriveLegal does not collect real fines. Pay official fines only through official government portals.
          </div>
        </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    printWin.document.open();
    printWin.document.write(receiptContent);
    printWin.document.close();
  };

  const getSeverity = () => {
    if (totalPoints >= 6 || totalFine >= 8000 || (countryCode === 'US' && totalPoints >= 2) || (countryCode === 'UK' && totalPoints >= 6)) {
      return { level: 'danger', label: 'CRITICAL WARNING: LICENSE SUSPENSION RISK', text: 'You have triggered high-severity demerits or heavy fines. In most regions, this results in immediate vehicle impoundment, driver license disqualification (for 3-12 months), and potential compulsory court hearings.' };
    }
    if (totalFine > 0 || totalPoints > 0) {
      return { level: 'warning', label: 'WARNING LEVEL: ACTIVE INFRACIONS', text: 'You have accumulated compounding traffic fines. Please drive with caution. Unsettled challans result in vehicle blockings and increased insurance premiums.' };
    }
    return { level: 'safe', label: 'COMPLIANT STANDING: SAFE RECORD', text: 'Zero active violations selected. Perfect compliance! You are ready to drive safely on public roads.' };
  };

  const severity = getSeverity();

  return (
    <div className="calc-container">
      {/* LEFT INPUT & SELECTORS */}
      <div className="glass-panel calc-selector-box">
        <h2 className="calc-section-title">1. Location Override</h2>

        {/* Country and state select rows */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Region/Country</span>
            <select
              className="location-selector"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{ padding: '10px 14px' }}
            >
              {Object.entries(lawDatabase.countries).map(([code, c]) => (
                <option key={code} value={code}>{c.name} ({c.currency})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>State/Province</span>
            <select
              className="location-selector"
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              disabled={Object.keys(states).length === 0}
              style={{ padding: '10px 14px' }}
            >
              {Object.entries(states).map(([code, s]) => (
                <option key={code} value={code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="calc-section-title" style={{ marginTop: '10px' }}>2. Vehicle Classification</h2>

        {/* Vehicle Selection Grid */}
        <div className="vehicle-grid-selection">
          <div
            className={`vehicle-option-card ${vehicleType === 'motorcycle' ? 'active' : ''}`}
            onClick={() => setVehicleType('motorcycle')}
          >
            <Bike size={28} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Two-Wheeler</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Motorcycle / Scooter</span>
          </div>

          <div
            className={`vehicle-option-card ${vehicleType === 'car' ? 'active' : ''}`}
            onClick={() => setVehicleType('car')}
          >
            <Car size={28} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Light Vehicle</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Car / SUV / Auto</span>
          </div>

          <div
            className={`vehicle-option-card ${vehicleType === 'commercial' ? 'active' : ''}`}
            onClick={() => setVehicleType('commercial')}
          >
            <Truck size={28} />
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Commercial</div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Truck / Bus / Cargo</span>
          </div>
        </div>

        <h2 className="calc-section-title" style={{ marginTop: '10px' }}>3. Select Infractions</h2>

        {/* Violations Category Accordion */}
        <div className="violations-accordion">
          {Object.entries(countryData.categories).map(([catKey, category]) => {
            // Filter rules relevant to selected vehicle
            const relevantRules = category.rules.filter(rule =>
              rule.vehicleTypes.includes(vehicleType) || rule.vehicleTypes.includes('all')
            );

            if (relevantRules.length === 0) return null;

            const isCatActive = activeCategory === catKey;

            return (
              <div key={catKey} className="violation-accordion-item">
                <div
                  className="accordion-header"
                  onClick={() => setActiveCategory(isCatActive ? '' : catKey)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{category.name}</strong>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                      {relevantRules.length} items
                    </span>
                  </span>
                  <span>{isCatActive ? '−' : '+'}</span>
                </div>

                {isCatActive && (
                  <div className="accordion-content">
                    {relevantRules.map((rule) => {
                      let fine = rule.baseFine;

                      // State adjustment or override
                      if (stateCode && rule.stateOverrides && rule.stateOverrides[stateCode]) {
                        fine = rule.stateOverrides[stateCode].baseFine !== undefined ? rule.stateOverrides[stateCode].baseFine : fine;
                      } else if (stateCode && states[stateCode]) {
                        fine = Math.round(fine * states[stateCode].factor);
                      }

                      return (
                        <label key={rule.id} className="violation-checkbox-row">
                          <input
                            type="checkbox"
                            checked={!!selectedViolations[rule.id]}
                            onChange={(e) => handleCheckboxChange(rule.id, e.target.checked)}
                          />
                          <div className="violation-info-label">
                            <span className="violation-title-lbl">{rule.title}</span>
                            <span className="violation-citation-lbl">Statutory Citation: {rule.section}</span>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '4px', alignItems: 'center' }}>
                              <span className="violation-fine-lbl">
                                Fine: {countryData.symbol}{fine.toLocaleString()}
                              </span>
                              {rule.points > 0 && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--color-warning)', fontWeight: '600' }}>
                                  +{rule.points} Demerits
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT RESULTS COLUMN */}
      <div className="calc-results-sidebar">
        {/* Fines and Points Result card */}
        <div className="glass-panel results-card">
          <span className="results-lbl">Total Fine Sum</span>
          <span className="results-val">
            {countryData.symbol}{totalFine.toLocaleString()}
          </span>
          {totalPoints > 0 && (
            <span className="results-points">
              {totalPoints} Demerit Points
            </span>
          )}

          {/* Dynamic Warning notification */}
          <div className={`severity-warning-box ${severity.level}`} style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', fontWeight: 'bold', marginBottom: '6px' }}>
              <AlertTriangle size={16} />
              {severity.label}
            </div>
            {severity.text}
          </div>

          {/* Reset and Print Row */}
          <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '24px' }}>
            <button
              className="icon-btn"
              onClick={handleReset}
              title="Reset Selection"
              style={{ width: '48px', height: '48px' }}
            >
              <RefreshCw size={18} />
            </button>

            <button
              className="glow-btn glow-btn-teal"
              onClick={printReceipt}
              style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', height: '48px', padding: '0 16px' }}
              disabled={totalFine === 0}
            >
              <Printer size={18} />
              Print Citation Sheet
            </button>
          </div>
        </div>

        {/* Selected breakdown listing preview */}
        <div className="glass-panel challan-receipt-preview" style={{ flexGrow: 1 }}>
          <h2 className="receipt-title">
            <FileText size={14} style={{ color: 'var(--color-secondary)', verticalAlign: 'middle', marginRight: '6px' }} />
            Active Breakdown
          </h2>

          <div className="receipt-items-list">
            {Object.entries(selectedViolations).some(([_, checked]) => checked) ? (
              Object.entries(selectedViolations).map(([ruleId, checked]) => {
                if (!checked) return null;

                let foundRule = null;
                for (const category of Object.values(countryData.categories)) {
                  const rule = category.rules.find(r => r.id === ruleId);
                  if (rule) {
                    foundRule = rule;
                    break;
                  }
                }

                if (!foundRule) return null;

                let fine = foundRule.baseFine;
                if (stateCode && foundRule.stateOverrides && foundRule.stateOverrides[stateCode]) {
                  fine = foundRule.stateOverrides[stateCode].baseFine !== undefined ? foundRule.stateOverrides[stateCode].baseFine : fine;
                } else if (stateCode && states[stateCode]) {
                  fine = Math.round(fine * states[stateCode].factor);
                }

                return (
                  <div key={ruleId} className="receipt-item-row">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '75%' }}>
                      <span style={{ fontWeight: '500' }}>{foundRule.title}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{foundRule.section}</span>
                    </div>
                    <span>{countryData.symbol}{fine.toLocaleString()}</span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.82rem' }}>
                <CheckCircle2 size={32} style={{ color: 'var(--color-success)', opacity: 0.3, marginBottom: '8px' }} />
                <p>Safe Driving Record.<br />No infractions currently checked.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
