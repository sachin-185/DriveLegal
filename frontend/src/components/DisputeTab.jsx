import React, { useState } from 'react';
import { 
  FileCheck2, ShieldAlert, Upload, CheckCircle2, AlertTriangle, 
  Clock, MapPin, Camera, FileText, Download, RotateCcw, ArrowRight,
  ExternalLink, Sparkles, XCircle, Search, ShieldCheck, Car
} from 'lucide-react';

export default function DisputeTab({ defaultLocation }) {
  const [selectedChallanId, setSelectedChallanId] = useState('CH-TN-88219');
  const [customPlate, setCustomPlate] = useState('TN-01-AB-1234');
  const [disputeReason, setDisputeReason] = useState('fastag_alibi');
  const [evidenceType, setEvidenceType] = useState('toll_receipt');
  const [uploadedFileName, setUploadedFileName] = useState('FASTag_Toll_Statement_NH44.pdf');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [activeStep, setActiveStep] = useState(1); // 1: Select Challan, 2: Upload Proof, 3: AI Audit Result

  // Sample real-world false challan dockets for demonstration
  const [challanDockets, setChallanDockets] = useState([
    {
      id: 'CH-TN-88219',
      plate: 'TN-01-AB-1234',
      vehicle: 'Hyundai Creta (White)',
      violation: 'Non-HSRP Plate / Camera Misread in Chennai',
      section: 'Section 177 & MoRTH HSRP Rules',
      fine: 1000,
      timestamp: '12 Mar 2026, 14:35 IST',
      location: 'Anna Salai ANPR Junction, Chennai',
      status: 'Active',
      cameraProof: 'Camera misread character 8 as B on non-HSRP plate.'
    },
    {
      id: 'CH-TN-90144',
      plate: 'TN-01-AB-1234',
      vehicle: 'Hyundai Creta (White)',
      violation: 'Overspeeding Camera Flag (82 km/h in 60 zone)',
      section: 'Section 183(1) MVA',
      fine: 1000,
      timestamp: '14 Mar 2026, 11:20 IST',
      location: 'OMR IT Corridor Camera #4, Chennai',
      status: 'Active',
      cameraProof: 'Radar pulse flagged 82 km/h at KM-14.'
    },
    {
      id: 'CH-TN-77312',
      plate: 'TN-09-CD-5678',
      vehicle: 'Maruti Swift (Grey)',
      violation: 'Red Light Stop Line Violation',
      section: 'Section 184(c) MVA',
      fine: 1000,
      timestamp: '10 Mar 2026, 17:42 IST',
      location: 'T. Nagar Panagal Park Signal, Chennai',
      status: 'Active',
      cameraProof: 'Vehicle crossed white stop line during red signal.'
    }
  ]);

  const activeDocket = challanDockets.find(c => c.id === selectedChallanId) || challanDockets[0];

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAuditResult(null);

    // Simulate multi-tier AI Proof Verification pipeline
    setTimeout(() => {
      setIsAnalyzing(false);

      if (disputeReason === 'fastag_alibi') {
        setAuditResult({
          status: 'REVOKED',
          confidence: 99.2,
          reasonTitle: 'Physical Alibi Verified via FASTag Toll Audit',
          summary: 'FASTag electronic toll logs confirm your vehicle crossed Chennasamudram Toll Plaza (NH-48) at 14:18 IST, exactly 17 minutes before the citation timestamp in Anna Salai (Chennai). Physical transit between these coordinates requires a minimum of 115 minutes, proving geometric and kinematic impossibility.',
          evidenceSummary: [
            'Toll Docket: NPCI FASTag Transaction #TXN-9844201',
            'Timestamp: 12 Mar 2026, 14:18:04 IST',
            'Location Delta: 98.4 km away from ANPR camera',
            'Verdict: Clone vehicle or camera character misrecognition'
          ],
          statutoryGround: 'Rule 139 CMVR / Section 184 MVA (Statutory Invalidation for Lack of Physical Presence)',
          revocationDocketNumber: `TN-REV-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else if (disputeReason === 'ambulance_yielding') {
        setAuditResult({
          status: 'REVOKED',
          confidence: 98.6,
          reasonTitle: 'Emergency Yield Exemption Validated',
          summary: 'Dashcam and junction audio-optical analysis confirmed an active emergency 108 Ambulance with siren was directly behind your vehicle. Advancing past the stop line was legally mandated under Central Motor Vehicles Rules.',
          evidenceSummary: [
            'Emergency Vehicle Detected: 108 Ambulance (TN-01-G-9912)',
            'Audio-Siren Frequency Match: 100% verified',
            'MoRTH Exemption Clause: Section 194E MVA Immunity',
            'Verdict: Citizen complied with mandatory emergency clearance'
          ],
          statutoryGround: 'Section 194E MVA & Good Samaritan Transit Directive',
          revocationDocketNumber: `TN-REV-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else if (disputeReason === 'camera_clone_misread') {
        setAuditResult({
          status: 'REVOKED',
          confidence: 97.8,
          reasonTitle: 'ANPR Character Segmentation Glitch Detected',
          summary: 'AI Vision inspection of the raw camera frame reveals an optical glare artifact causing character "B" to be misclassified as "8". Vehicle in the capture frame is a Sedan, whereas registered profile is a Compact SUV.',
          evidenceSummary: [
            'Visual Discrepancy: Vehicle body silhouette mismatch (Sedan vs SUV)',
            'Plate Segmentation Error: Alpha-numeric confidence 42% (below 85% legal threshold)',
            'Optical Glare Detection: Validated at character index 8',
            'Verdict: Erroneous ANPR OCR docket generation'
          ],
          statutoryGround: 'MoRTH AI ANPR Certification Standard (AIS-140)',
          revocationDocketNumber: `TN-REV-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else {
        setAuditResult({
          status: 'REVOKED',
          confidence: 99.5,
          reasonTitle: 'Active Digital Credentials Verified via DigiLocker',
          summary: 'Digital records extracted from the National Register confirm your Driving Licence and Pollution (PUC) certificate were active and certified on the date and hour of citation.',
          evidenceSummary: [
            'Digital Document: DigiLocker Certificate #DL-908129',
            'Validation Timestamp: 100% active on citation date',
            'Rule 139 CMVR: Physical paper demand is statutory violation',
            'Verdict: Immediate dismissal of document citation'
          ],
          statutoryGround: 'Rule 139 CMVR & MoRTH Circular RT-11036/64/2017-MVL',
          revocationDocketNumber: `TN-REV-${Math.floor(100000 + Math.random() * 900000)}`
        });
      }

      // Mark the selected challan as dismissed in state
      setChallanDockets(prev => prev.map(c => c.id === selectedChallanId ? { ...c, status: 'Revoked via AI Audit' } : c));
      setActiveStep(3);
    }, 1800);
  };

  const handleDownloadPetition = () => {
    alert(`📄 Statutory Revocation Petition [Docket ${auditResult?.revocationDocketNumber}] compiled successfully!\n\nThis legal petition includes:\n1. Algorithmic Evidence Digest\n2. FASTag/GPS Kinematic Impossibility Certificate\n3. Statutory Invocation of Rule 139 CMVR\n4. Digital e-Challan Cancellation Endorsement`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderLeft: '4px solid var(--color-secondary)',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.04) 100%)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="law-citation-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                LIVE AI GRIEVANCE ENGINE
              </span>
              <span className="law-citation-badge" style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd' }}>
                ZERO MANUAL DELAY
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', margin: '4px 0 8px 0' }}>
              Instant AI e-Challan Dispute & Evidence Verification
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', maxWidth: '920px' }}>
              On the official Parivahan portal, reporting a wrong camera challan requires weeks of manual RTO review. 
              <strong> DriveLegal AI</strong> instantly audits your uploaded <strong>GPS logs, FASTag toll receipts, dashcam photos, or DigiLocker records</strong>, performs kinematic proof verification, and generates an official <strong>Statutory Revocation Order</strong> in seconds.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Sparkles size={20} style={{ color: 'var(--color-secondary)' }} />
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Resolution Time</span>
              <strong style={{ fontSize: '0.92rem', color: '#6ee7b7' }}>&lt; 2 Seconds</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div 
          onClick={() => setActiveStep(1)}
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            background: activeStep === 1 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${activeStep === 1 ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: activeStep === 1 ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: 'white'
          }}>1</div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'white', display: 'block' }}>Select False Challan</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Identify ticket & docket</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveStep(2)}
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            background: activeStep === 2 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${activeStep === 2 ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: activeStep === 2 ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: 'white'
          }}>2</div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'white', display: 'block' }}>Attach Evidence</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FASTag, GPS, or Dashcam</span>
          </div>
        </div>

        <div 
          onClick={() => auditResult && setActiveStep(3)}
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            background: activeStep === 3 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${activeStep === 3 ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.08)'}`,
            cursor: auditResult ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: auditResult ? 1 : 0.6
          }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: activeStep === 3 ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem', color: 'white'
          }}>3</div>
          <div>
            <strong style={{ fontSize: '0.88rem', color: 'white', display: 'block' }}>Instant AI Verdict</strong>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Revocation & Petition</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Select or Lookup Challan */}
      {activeStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldAlert size={18} style={{ color: 'var(--color-primary)' }} />
              Active Outstanding Challans
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '16px' }}>
              Select an erroneous camera challan below to launch automated proof verification:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {challanDockets.map((c) => {
                const isSelected = selectedChallanId === c.id;
                const isRevoked = c.status.includes('Revoked');
                return (
                  <div 
                    key={c.id}
                    onClick={() => setSelectedChallanId(c.id)}
                    style={{
                      padding: '16px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : isRevoked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: 'white', fontSize: '0.9rem' }}>{c.id}</span>
                        <span className="law-citation-badge">{c.plate}</span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: isRevoked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                        color: isRevoked ? '#6ee7b7' : '#fca5a5'
                      }}>
                        {c.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>
                      {c.violation}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span>📍 {c.location}</span>
                      <strong style={{ color: 'var(--color-secondary)' }}>Fine: ₹{c.fine}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Docket Details & Reason Picker */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Dispute Docket Parameters
            </h3>

            <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SELECTED CITATION</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginTop: '2px' }}>{activeDocket.id}</div>
              <div style={{ fontSize: '0.82rem', color: '#93c5fd', marginTop: '4px' }}>{activeDocket.section} • {activeDocket.timestamp}</div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
                <strong>Camera Telemetry:</strong> {activeDocket.cameraProof}
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Select Your Legal Defense Grounds:
              </label>
              <select 
                className="location-selector"
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                style={{ width: '100%', padding: '10px 12px' }}
              >
                <option value="fastag_alibi">📍 Vehicle Was Elsewhere (FASTag Toll / GPS Log Proof)</option>
                <option value="ambulance_yielding">🚑 Cleared Way for Emergency Vehicle / Ambulance</option>
                <option value="camera_clone_misread">📷 ANPR OCR Glare / Mismatched Plate Character</option>
                <option value="digilocker_active">📱 Valid Credentials Active in DigiLocker/mParivahan</option>
              </select>
            </div>

            <button
              className="login-btn"
              onClick={() => setActiveStep(2)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: 'auto' }}
            >
              <span>Continue to Attach Proof</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Attach Evidence & Launch AI Audit */}
      {activeStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={18} style={{ color: 'var(--color-secondary)' }} />
              Upload Corroborating Evidence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginBottom: '20px' }}>
              The AI engine uses OCR, GPS coordinates, and FASTag toll clearance hashes to mathematically confirm your defense:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Evidence Source Format:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div 
                    onClick={() => { setEvidenceType('toll_receipt'); setUploadedFileName('FASTag_Toll_Statement_NH48.pdf'); }}
                    style={{
                      padding: '12px', borderRadius: '6px',
                      background: evidenceType === 'toll_receipt' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${evidenceType === 'toll_receipt' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer', textAlign: 'center'
                    }}
                  >
                    <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>FASTag Toll Receipt</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bank / NPCI Transaction</span>
                  </div>

                  <div 
                    onClick={() => { setEvidenceType('gps_log'); setUploadedFileName('GoogleMaps_Timeline_Export.json'); }}
                    style={{
                      padding: '12px', borderRadius: '6px',
                      background: evidenceType === 'gps_log' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${evidenceType === 'gps_log' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                      cursor: 'pointer', textAlign: 'center'
                    }}
                  >
                    <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>GPS Timeline Log</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Google / Dashcam Telemetry</span>
                  </div>
                </div>
              </div>

              {/* Upload Dropzone Simulation */}
              <div style={{
                padding: '30px 20px',
                borderRadius: '8px',
                border: '2px dashed rgba(59, 130, 246, 0.3)',
                background: 'rgba(59, 130, 246, 0.03)',
                textAlign: 'center',
                cursor: 'pointer'
              }}>
                <FileCheck2 size={36} style={{ color: 'var(--color-secondary)', margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '0.92rem', color: 'white', margin: '0 0 4px 0' }}>
                  {uploadedFileName}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Ready for AI Optical & Cryptographic Inspection (4.2 MB)
                </p>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '0.8rem', color: '#6ee7b7', fontWeight: '600' }}>
                  🛡️ Parivahan Automated Dispute Bridge Ready:
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Evidence is parsed entirely on your device. No private GPS coordinates or banking credentials leave your browser unencrypted.
                </p>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Execute AI Proof Audit
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Target Challan:</span>
                <strong style={{ color: 'white' }}>{activeDocket.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Defense Strategy:</span>
                <strong style={{ color: '#93c5fd' }}>
                  {disputeReason === 'fastag_alibi' ? 'Location Alibi' : disputeReason === 'ambulance_yielding' ? 'Ambulance Clearance' : 'ANPR Glare Check'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Verification Speed:</span>
                <strong style={{ color: 'var(--color-secondary)' }}>~1,200 ms</strong>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="login-btn"
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10B981, #059669)'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <RotateCcw className="animate-spin" size={18} />
                    <span>Auditing Evidence & Kinematics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Verify Proof & Cancel Ticket</span>
                  </>
                )}
              </button>

              <button 
                onClick={() => setActiveStep(1)}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Back to Challan Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: AI Verdict & Revocation Petition */}
      {activeStep === 3 && auditResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Verdict Banner */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderLeft: '4px solid var(--color-success)',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.05) 100%)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="law-citation-badge" style={{ background: 'rgba(16, 185, 129, 0.25)', color: '#6ee7b7' }}>
                      DECISION: FALSE CITATION REVOKED
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Docket ID: <strong>{auditResult.revocationDocketNumber}</strong>
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'white', margin: '6px 0' }}>
                    {auditResult.reasonTitle}
                  </h2>
                  <p style={{ color: '#d1fae5', fontSize: '0.88rem', lineHeight: '1.5', maxWidth: '880px', margin: 0 }}>
                    {auditResult.summary}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Evidence Match Confidence</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
                  {auditResult.confidence}%
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'white', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck2 size={18} style={{ color: 'var(--color-secondary)' }} />
                Algorithmic Audit Telemetry
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {auditResult.evidenceSummary.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '12px 14px',
                    borderRadius: '6px',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '0.84rem',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <CheckCircle2 size={14} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', padding: '12px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                <strong style={{ fontSize: '0.78rem', color: '#93c5fd' }}>Statutory Invocation Clause:</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  {auditResult.statutoryGround}
                </p>
              </div>
            </div>

            {/* Revocation Actions */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'white', margin: '0 0 10px 0' }}>
                  Official Grievance Dispatch
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.45', margin: 0 }}>
                  This revocation petition is electronically signed with your biometric key and formatted for the 
                  <strong> Tamil Nadu Traffic Police Notice Branch</strong> and the <strong>Virtual Court Registry</strong>.
                </p>

                <div style={{ margin: '16px 0', padding: '12px', borderRadius: '6px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>STATUS ON VAHAN GATEWAY</div>
                  <strong style={{ fontSize: '0.9rem', color: '#6ee7b7' }}>✓ Marked for Auto-Dismissal (Dispute Active)</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="login-btn"
                  onClick={handleDownloadPetition}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Download size={16} />
                  <span>Download Statutory Revocation PDF</span>
                </button>

                <button
                  onClick={() => { setActiveStep(1); setAuditResult(null); }}
                  style={{
                    padding: '10px',
                    borderRadius: '6px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-muted)',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Dispute Another Challan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

