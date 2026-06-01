import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Mic, MicOff, Volume2, VolumeX, ShieldAlert, Sparkles, 
  BookOpen, AlertTriangle, Database, Cpu, Plus, Layers, CheckCircle,
  Camera, Download, Loader2
} from 'lucide-react';
import { analyzeQuery } from '../utils/nlpEngine';

export default function ChatbotTab({ defaultLocation }) {
  const [messages, setMessages] = useState([]);
  // Dynamic greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    if (hour >= 5 && hour < 12) greeting = 'Good morning';
    else if (hour >= 12 && hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    const welcomeMsg = {
      sender: 'assistant',
      text: `${greeting}! I'm **DriveLegal**, your AI assistant for road safety. \nI support high-fidelity **ChromaDB Semantic Vector Search**! \n\nHow can I help you check traffic fines, license points, or road safety protocols today? Try asking me:\n* *"What is the fine for speeding in California?"*\n* *"No helmet fine in Karnataka"*\n* *"What is the limit for drunk driving in Scotland?"*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMsg]);
  }, []);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [safetyScore, setSafetyScore] = useState(100);
  const chatScrollerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Client-Side OCR Tesseract.js States
  const ocrFileInputRef = useRef(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Sync safety score from active user on tab load
  useEffect(() => {
    const active = JSON.parse(localStorage.getItem('drivelegal_active_user'));
    if (active) {
      setSafetyScore(active.safetyScore || 100);
    }
  }, []);

  // Client-Side OCR File Decryption Handler
  const handleOcrFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.Tesseract) {
      alert("Tesseract.js OCR engine is still loading. Please ensure you are connected to the network.");
      return;
    }

    setOcrLoading(true);
    setOcrProgress(0);

    const scanMsgId = Date.now();
    const scanningMessage = {
      id: scanMsgId,
      sender: 'assistant',
      text: `🔍 **STATUTORY SCANNER ACTIVE**\nScanning and decrypting ticket image \`${file.name}\` via client-side OCR... please wait.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, scanningMessage]);

    try {
      const result = await window.Tesseract.recognize(
        file,
        'eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );

      const parsedText = result.data.text || '';
      
      // Clean up scanning message
      setMessages(prev => prev.filter(m => m.id !== scanMsgId));
      setOcrLoading(false);

      if (!parsedText.trim()) {
        alert("OCR completed, but no text was recognized. Please ensure the image has clear contrast.");
        return;
      }

      // Add user message with preview
      const userOcrMsg = {
        sender: 'user',
        text: `📷 [Parsed Challan Scanner OCR]:\n${parsedText.substring(0, 200)}...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, userOcrMsg]);

      // Simple heuristic parsing of OCR content
      let queryToSubmit = parsedText.substring(0, 150);
      const plateMatch = parsedText.toUpperCase().match(/\b((?:DL|CA|UK)[-\s]?[0-9A-Z]{2,4}[-\s]?[A-Z0-9]{2,4}[-\s]?[0-9]{4})\b/);
      
      if (plateMatch) {
        queryToSubmit = `Check vehicle details for license plate ${plateMatch[0]}`;
      } else {
        const textLower = parsedText.toLowerCase();
        let matchedActs = [];
        if (textLower.includes("speed") || textLower.includes("limit") || textLower.includes("22350")) matchedActs.push("speeding");
        if (textLower.includes("helmet") || textLower.includes("194d")) matchedActs.push("helmet rules");
        if (textLower.includes("seatbelt") || textLower.includes("194b")) matchedActs.push("seatbelt rules");
        if (textLower.includes("puc") || textLower.includes("pollution") || textLower.includes("190")) matchedActs.push("pollution PUC certificate");
        
        if (matchedActs.length > 0) {
          queryToSubmit = `What is the law and fine for ${matchedActs.join(" and ")}?`;
        }
      }

      // Automatically trigger response sequence
      handleSend(queryToSubmit);
    } catch (ocrErr) {
      console.error("OCR Scan failed:", ocrErr);
      setMessages(prev => prev.filter(m => m.id !== scanMsgId));
      setOcrLoading(false);
      alert("OCR scanning failed. Please try a different ticket image.");
    }
  };

  // Client-Side Dynamic PDF Report Generator (jsPDF)
  const downloadCitationPdf = (text) => {
    if (!window.jspdf) {
      alert("PDF download engine is still loading. Please wait a moment.");
      return;
    }

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Standardize clean text by stripping markdown symbols
      const cleanText = text
        .replace(/\*\*|__/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/###/g, '')
        .replace(/>\s*\[!WARNING\]/g, 'WARNING:')
        .replace(/^>\s*/g, '');

      const lines = cleanText.split('\n');

      // Styles: Dark corporate compliance header
      doc.setFillColor(6, 9, 19);
      doc.rect(0, 0, 210, 35, 'F');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("DRIVELEGAL AI COMPLIANCE REPORT", 14, 22);

      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(180, 180, 180);
      doc.text(`Official Document ID: DL-RPT-${Math.floor(100000 + Math.random() * 900000)} | Generated on ${new Date().toLocaleString()}`, 14, 30);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);

      let yPos = 48;
      
      lines.forEach(line => {
        if (!line.trim()) {
          yPos += 4;
          return;
        }

        // Subheaders
        if (line.startsWith('###') || line.startsWith('Traffic') || line.startsWith('Outstanding')) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.setTextColor(99, 102, 241);
          yPos += 4;
          doc.text(line.replace('###', '').trim(), 14, yPos);
          yPos += 6;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(10);
          doc.setTextColor(60, 60, 60);
          return;
        }

        const wrappedLine = doc.splitTextToSize(line, 180);
        wrappedLine.forEach(subLine => {
          if (yPos > 275) {
            doc.addPage();
            yPos = 20;
          }
          
          if (subLine.includes('⚖️') || subLine.includes('💵') || subLine.includes('⚠️')) {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(15, 23, 42);
          } else {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 60, 60);
          }

          doc.text(subLine, 14, yPos);
          yPos += 6;
        });
      });

      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }
      doc.setDrawColor(220, 220, 220);
      doc.line(14, yPos + 10, 196, yPos + 10);
      
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text("Disclaimer: This report constitutes a legal guide compiled through Grounded ChromaDB RAG. Validate credentials locally.", 14, yPos + 16);
      doc.text("DriveLegal AI Compliance Companion (Road Safety 2026)", 14, yPos + 21);

      doc.save(`DriveLegal-Report-${Date.now()}.pdf`);
    } catch (pdfErr) {
      console.error("PDF generation failed:", pdfErr);
      alert("Failed to export PDF report.");
    }
  };

  // ChromaDB Integration States
  const [chromaStatus, setChromaStatus] = useState({
    connected: false,
    version: '',
    count: 0,
    loading: true
  });
  const [useChroma, setUseChroma] = useState(true);

  // ChromaDB Document Seeding Form States
  const [seedId, setSeedId] = useState('');
  const [seedDoc, setSeedDoc] = useState('');
  const [seedCategory, setSeedCategory] = useState('technology');
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');

  // Auto-scroll chats
  useEffect(() => {
    if (chatScrollerRef.current) {
      chatScrollerRef.current.scrollTop = chatScrollerRef.current.scrollHeight;
    }
  }, [messages]);

  // ChromaDB health status polling
  useEffect(() => {
    const checkChromaHealth = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/health');
        const data = await res.json();
        if (data.success && data.status === 'connected') {
          setChromaStatus({
            connected: true,
            version: data.version,
            count: data.documentsCount,
            loading: false
          });
        } else {
          setChromaStatus(prev => ({ ...prev, connected: false, loading: false }));
        }
      } catch (err) {
        setChromaStatus(prev => ({ ...prev, connected: false, loading: false }));
      }
    };

    checkChromaHealth();
    const interval = setInterval(checkChromaHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  // Speech Recognition setup (Browser Native)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  // Handle Voice Toggle
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported on this browser. Try Chrome or Edge!");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Text to Speech
  const speakText = (text) => {
    if (!speechEnabled) return;
    window.speechSynthesis.cancel(); // Stop current speech
    
    // Strip markdown formatting for cleaner speech
    const cleanText = text
      .replace(/\*\*|__/g, '')
      .replace(/\* /g, '')
      .replace(/###/g, '')
      .replace(/>\s*\[!WARNING\]/g, 'Warning:')
      .replace(/`[^`]+`/g, (m) => m.replace(/`/g, ''));

    const utterance = new SpeechSynthesisUtterance(cleanText);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Simulate typing delay
    setIsTyping(true);
      setTimeout(async () => {
      let responseText = '';
      let ruleMatched = null;
      let chromaMatched = false;

      // 1. Attempt Grounded RAG Chat synthesis if enabled and server is online
      if (useChroma && chromaStatus.connected) {
        try {
          const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: query, useChroma: true })
          });
          const data = await response.json();
          
          if (data.success && data.responseText) {
            chromaMatched = true;
            responseText = data.responseText;
          }
        } catch (error) {
          console.error("Error calling Grounded RAG Chat:", error);
        }
      }

      // 2. Fall back to standard NLP Rule Matcher if Chroma didn't find a match or is offline
      if (!chromaMatched) {
        const result = analyzeQuery(query, defaultLocation);
        responseText = result.responseText;
        ruleMatched = result.ruleMatched;

        // Adjust safety score based on standard rules
        if (ruleMatched) {
          const scoreDelta = (ruleMatched.points > 4 || ruleMatched.baseFine > 4000) ? -15 : 5;
          setSafetyScore(prev => {
            const nextScore = scoreDelta < 0 ? Math.max(30, prev - 15) : Math.min(100, prev + 5);
            
            // Sync safety score change back to database if online
            const activeUser = JSON.parse(localStorage.getItem('drivelegal_active_user'));
            if (activeUser && activeUser.username) {
              fetch('http://localhost:3000/api/auth/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: activeUser.username, safetyScore: nextScore })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.success && data.user) {
                    localStorage.setItem('drivelegal_active_user', JSON.stringify(data.user));
                  }
                })
                .catch(err => {
                  console.log("Failed to sync safety score online, relying on local storage:", err.message);
                });
            }
            return nextScore;
          });
        } else {
          // ChromaDB query safety rating update
          setSafetyScore(prev => {
            const nextScore = Math.min(100, prev + 2);
            const activeUser = JSON.parse(localStorage.getItem('drivelegal_active_user'));
            if (activeUser && activeUser.username) {
              fetch('http://localhost:3000/api/auth/update-score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: activeUser.username, safetyScore: nextScore })
              })
                .then(res => res.json())
                .then(data => {
                  if (data.success && data.user) {
                    localStorage.setItem('drivelegal_active_user', JSON.stringify(data.user));
                  }
                })
                .catch(err => {});
            }
            return nextScore;
          });
        }
      } else {
        // Boost safety rating slightly for successful semantic lookup
        setSafetyScore(prev => Math.min(100, prev + 2));
      }

      const assistantMsg = {
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ruleMatched
      };

      setMessages(prev => [...prev, assistantMsg]);
      speakText(responseText);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Seeding form submission
  const handleSeedSubmit = async (e) => {
    e.preventDefault();
    if (!seedId.trim() || !seedDoc.trim()) {
      setSeedStatus('Please enter both ID and document text.');
      return;
    }

    setIsSeeding(true);
    setSeedStatus('Connecting...');

    try {
      const response = await fetch('http://localhost:3000/api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: [seedId.trim()],
          documents: [seedDoc.trim()],
          metadatas: [{ category: seedCategory.trim(), timestamp: new Date().toISOString() }]
        })
      });

      const data = await response.json();
      if (data.success) {
        setSeedStatus('Document added successfully!');
        setSeedId('');
        setSeedDoc('');
        
        // Refresh counts
        const healthRes = await fetch('http://localhost:3000/api/health');
        const healthData = await healthRes.json();
        if (healthData.success) {
          setChromaStatus(prev => ({ ...prev, count: healthData.documentsCount }));
        }

        // Celebrate with confetti
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 }
          });
        });
      } else {
        setSeedStatus(`Failed: ${data.message}`);
      }
    } catch (err) {
      setSeedStatus(`Error: ${err.message}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // Helper to render basic markdown inside simple paragraphs
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    let inAlert = false;
    let alertContent = [];

    return lines.map((line, idx) => {
      // Alert block detection
      if (line.startsWith('> [!WARNING]')) {
        inAlert = true;
        return null;
      }
      if (inAlert && line.startsWith('>')) {
        alertContent.push(line.replace(/^>\s*/, ''));
        return null;
      } else if (inAlert) {
        inAlert = false;
        const alertText = alertContent.join(' ');
        alertContent = [];
        return (
          <div key={`alert-${idx}`} className="severity-warning-box danger" style={{ margin: '12px 0' }}>
            <div style={{ display: 'flex', gap: '8px', fontWeight: 'bold', marginBottom: '4px' }}>
              <AlertTriangle size={16} /> HIGH SEVERITY OFFENSE
            </div>
            {alertText}
          </div>
        );
      }

      // Headers
      if (line.startsWith('### ')) {
        return <h3 key={idx}>{line.substring(4)}</h3>;
      }
      
      // List items
      if (line.startsWith('* ')) {
        const content = line.substring(2);
        return <li key={idx}>{parseInlineMarkdown(content)}</li>;
      }

      // Standard text
      if (line.trim() === '') return <div key={idx} style={{ height: '8px' }} />;
      return <p key={idx} style={{ marginBottom: '8px' }}>{parseInlineMarkdown(line)}</p>;
    });
  };

  const parseInlineMarkdown = (text) => {
    // Basic regex replacing **bold** and `code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="law-citation-badge" style={{ verticalAlign: 'middle' }}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  const suggestions = [
    "Speeding fine in California for car",
    "No seatbelt fine in Tamil Nadu",
    "Emergency numbers in United Kingdom",
    "Drunk driving limit in Scotland",
    "License renewal process in India",
    "Helmet law in Karnataka",
    "Traffic camera detection FAQ"
  ];

  return (
    <div className="chat-tab-container">
      {/* LEFT CHAT BOX */}
      <div className="glass-panel chat-messages-box">
        {/* Chat window sub-header showing engine status */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '12px 18px', 
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(8, 12, 24, 0.4)',
          fontSize: '0.8rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Cpu size={14} style={{ color: chromaStatus.connected && useChroma ? 'var(--color-secondary)' : 'var(--text-muted)' }} />
            <span>Search Engine: <strong>{chromaStatus.connected && useChroma ? '⚡ ChromaDB Semantic AI' : '📴 Offline Rules Engine'}</strong></span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={14} />
              <span style={{ color: safetyScore > 75 ? 'var(--color-success)' : safetyScore > 50 ? 'var(--color-warning)' : 'var(--color-danger)' }}>
                Safety Score: {safetyScore}
              </span>
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={useChroma} 
              disabled={!chromaStatus.connected}
              onChange={(e) => setUseChroma(e.target.checked)}
              style={{ accentColor: 'var(--color-secondary)', width: '14px', height: '14px' }}
            />
            <span style={{ color: chromaStatus.connected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              Enable Semantic Vector Search
            </span>
          </label>
        </div>

        {/* OCR Scanning Progress Indicator */}
        {ocrLoading && (
          <div className="glass-panel" style={{ margin: '10px 18px', padding: '12px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Loader2 size={18} style={{ color: 'var(--color-secondary)', animation: 'spin 1s linear infinite' }} />
            <div style={{ flexGrow: 1 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: 'white' }}>Challan Decryption Engine Active</span>
              <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${ocrProgress}%`, height: '100%', background: 'var(--color-secondary)', transition: 'width 0.2s ease-out' }} />
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--color-secondary)' }}>{ocrProgress}%</span>
          </div>
        )}

        {/* Chats scroller */}
        <div className="chat-scroller" ref={chatScrollerRef}>
            {isTyping && (
              <div className="chat-message-bubble assistant typing-indicator">
                <span className="typing-dots">···</span>
              </div>
            )}
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message-bubble ${msg.sender}`}>
              {msg.sender === 'assistant' ? (
                <div>
                  {renderMarkdown(msg.text)}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button 
                      className="suggestion-chip" 
                      onClick={() => downloadCitationPdf(msg.text)}
                      style={{ 
                        fontSize: '0.68rem', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        padding: '4px 8px', 
                        background: 'rgba(255,255,255,0.03)', 
                        color: 'var(--color-secondary)', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={11} />
                      Export Legal PDF
                    </button>
                  </div>
                </div>
              ) : (
                <p>{msg.text}</p>
              )}
              <span className="message-time">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Suggestion Chips */}
        <div className="suggested-chips">
          {suggestions.map((sug, i) => (
            <button key={i} className="suggestion-chip" onClick={() => handleSend(sug)}>
              {sug}
            </button>
          ))}
        </div>

        {/* Action input panel */}
        <div className="chat-input-row">
          <button 
            className={`icon-btn ${isListening ? 'active' : ''}`}
            onClick={toggleListening}
            title={isListening ? "Listening... click to stop" : "Use Voice Input (Speech to Text)"}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            className="icon-btn"
            onClick={() => ocrFileInputRef.current?.click()}
            title="Scan physical traffic ticket / challan (OCR)"
            style={{ color: 'var(--color-secondary)' }}
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={ocrFileInputRef} 
            onChange={handleOcrFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />

          <input 
            type="text" 
            className="chat-input-field" 
            placeholder={isListening ? "Listening..." : "Ask DriveLegal something... (e.g. speeding laws)"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button 
            className={`icon-btn ${speechEnabled ? 'active' : ''}`}
            onClick={() => setSpeechEnabled(!speechEnabled)}
            title={speechEnabled ? "Voice assistant enabled" : "Voice assistant muted"}
            style={{ color: speechEnabled ? 'var(--color-secondary)' : 'var(--text-muted)' }}
          >
            {speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button className="glow-btn" onClick={() => handleSend()}>
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* RIGHT SIDE PANEL INFO */}
      <div className="chat-info-column" style={{ overflowY: 'auto' }}>
        {/* Compliance Meter */}
        <div className="glass-panel safety-metric-box">
          <span className="results-lbl">Safety Score</span>
          <div className="meter-wrapper" style={{ marginTop: '16px' }}>
            <svg className="meter-ring" width="120" height="120">
              <defs>
                <linearGradient id="indigoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
              <circle className="meter-circle-bg" cx="60" cy="60" r="50"></circle>
              <circle 
                className="meter-circle-fill" 
                cx="60" 
                cy="60" 
                r="50" 
                style={{ strokeDashoffset: 314 - (314 * safetyScore) / 100 }}
              ></circle>
            </svg>
            <span className="meter-value">{safetyScore}</span>
          </div>
          <span className="results-points" style={{ 
            color: safetyScore > 75 ? 'var(--color-success)' : safetyScore > 50 ? 'var(--color-warning)' : 'var(--color-danger)',
            background: safetyScore > 75 ? 'var(--color-success-bg)' : safetyScore > 50 ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
            borderColor: safetyScore > 75 ? 'rgba(16, 185, 129, 0.2)' : safetyScore > 50 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)'
          }}>
            {safetyScore > 75 ? 'Safe Driver' : safetyScore > 50 ? 'Warning Level' : 'High Risk'}
          </span>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: '1.4' }}>
            {safetyScore > 75 
              ? 'Excellent record. Your safety score indicates high awareness and compliance with regional traffic limits.'
              : safetyScore > 50 
              ? 'Warning: Querying severe violations and high-fine infractions impact your rating. Review road laws!'
              : 'Critical Risk: Multiple violations or license points detected. Drivers at this level face potential license suspension.'}
          </p>
        </div>

        {/* ChromaDB Cloud Seeding Panel */}
        <div className="glass-panel rules-preview-panel">
          <h2 className="rules-heading">
            <Database size={16} style={{ color: chromaStatus.connected ? 'var(--color-secondary)' : 'var(--text-muted)' }} />
            ChromaDB Cloud Control
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
              <span style={{ 
                color: chromaStatus.connected ? 'var(--color-success)' : 'var(--color-warning)', 
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: chromaStatus.connected ? 'var(--color-success)' : 'var(--color-warning)',
                  display: 'inline-block'
                }} />
                {chromaStatus.connected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            
            {chromaStatus.connected && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Docs in Collection:</span>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{chromaStatus.count}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DB Version:</span>
                  <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{chromaStatus.version}</span>
                </div>
              </>
            )}
          </div>

          {chromaStatus.connected ? (
            <form onSubmit={handleSeedSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                Insert New Vector Document
              </span>
              
              <div>
                <input 
                  type="text" 
                  placeholder="Document Unique ID (e.g. 1)"
                  value={seedId}
                  onChange={(e) => setSeedId(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <textarea 
                  placeholder="Legal text content or safety rule..."
                  value={seedDoc}
                  onChange={(e) => setSeedDoc(e.target.value)}
                  rows="3"
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-body)'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Category"
                  value={seedCategory}
                  onChange={(e) => setSeedCategory(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid var(--border-color)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                
                <button 
                  type="submit" 
                  disabled={isSeeding}
                  className="glow-btn"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} />
                  {isSeeding ? 'Adding...' : 'Add'}
                </button>
              </div>

              {seedStatus && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: seedStatus.includes('successfully') ? 'var(--color-success)' : 'var(--color-danger)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {seedStatus.includes('successfully') && <CheckCircle size={12} />}
                  <span>{seedStatus}</span>
                </div>
              )}
            </form>
          ) : (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              To utilize ChromaDB Semantic Vector search and seed vector documents directly from this interface, start the Express middleware server by running:
              <code style={{ 
                display: 'block', 
                background: 'rgba(0,0,0,0.4)', 
                padding: '6px 10px', 
                borderRadius: '6px', 
                marginTop: '6px', 
                fontFamily: 'monospace',
                color: 'var(--color-secondary)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                npm run dev
              </code>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
