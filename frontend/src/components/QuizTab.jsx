import React, { useState } from 'react';
import { Award, CheckCircle, XCircle, HelpCircle, Trophy, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUESTIONS = [
  {
    id: 1,
    question: "Under India's Motor Vehicles Act 2019, what is the penalty for riding a two-wheeler without a helmet?",
    options: [
      "A verbal warning and ₹100 fine.",
      "₹500 fine and vehicle seizure.",
      "₹1,000 fine and disqualification of license for 3 months.",
      "₹2,000 fine and 5 hours of community service."
    ],
    answer: 2,
    explanation: "Under Section 194D of the Motor Vehicles Act, riding without a helmet attracts a ₹1,000 fine and suspension of the driving license for 3 months."
  },
  {
    id: 2,
    question: "What is the breath alcohol concentration (BrAC) limit for motorists in Scotland?",
    options: [
      "35 micrograms per 100ml of breath (same as England).",
      "22 micrograms per 100ml of breath (lower limit).",
      "50 micrograms per 100ml of breath.",
      "Zero tolerance (0 micrograms)."
    ],
    answer: 1,
    explanation: "Scotland reduced its drink-drive limit in 2014 to 22mcg of alcohol per 100ml of breath, making it significantly stricter than England, Wales, and Northern Ireland (35mcg)."
  },
  {
    id: 3,
    question: "What does a double solid yellow line in the center of a United States highway indicate?",
    options: [
      "Passing is permitted from both directions.",
      "Passing is permitted only from your side of the road.",
      "Passing/overtaking is strictly prohibited from either direction.",
      "Speed limit is reduced by half in this zone."
    ],
    answer: 2,
    explanation: "Double solid yellow lines indicate that passing or overtaking is prohibited in both directions of travel except when turning left into a driveway or side street."
  },
  {
    id: 4,
    question: "If you drive a non-compliant diesel car in London's Ultra Low Emission Zone (ULEZ) without paying the £12.50 daily charge, what is the standard penalty (PCN)?",
    options: [
      "£50 fixed penalty.",
      "£180 standard penalty charge (reduced to £90 if paid within 14 days).",
      "£500 penalty and vehicle impoundment.",
      "A court summons with no monetary fine."
    ],
    answer: 1,
    explanation: "Transport for London charges a £180 penalty charge notice (PCN) for non-payment of ULEZ driving, which is halved to £90 if settled within the initial 14 days."
  },
  {
    id: 5,
    question: "What is the primary statutory directive for a motorist in a roadside breakdown or minor collision?",
    options: [
      "Stand in the active traffic lane to flag down passing vehicles.",
      "Immediately inspect vehicle damage while remaining on active highway lanes.",
      "Pull over safely, switch on hazard indicators, secure the scene, and contact local roadside hotlines.",
      "Take photographs of the landscape first while waiting."
    ],
    answer: 2,
    explanation: "Safety first! Safely pull over on the shoulder or hard shoulder, activate hazard flashers, exit the vehicle to a secure zone behind crash barriers, and contact highway patrol."
  }
];

export default function QuizTab() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Badge unlock state trackers
  const [badges, setBadges] = useState({
    novice: { name: "Novice Driver", unlocked: false, desc: "Answer 1 question correctly" },
    citizen: { name: "Law-Abiding Citizen", unlocked: false, desc: "Answer 3 questions correctly" },
    champion: { name: "Road Safety Champion", unlocked: false, desc: "Get a perfect score of 5/5!" }
  });

  const handleOptionClick = (optIdx) => {
    if (isAnswered) return;
    setSelectedOpt(optIdx);
    setIsAnswered(true);

    const question = QUESTIONS[currentIdx];
    const isCorrect = optIdx === question.answer;

    let newScore = score;
    let newStreak = streak;

    if (isCorrect) {
      newScore += 1;
      newStreak += 1;
      setScore(newScore);
      setStreak(newStreak);
      
      // Trigger mini confetti
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.8 }
      });
    } else {
      newStreak = 0;
      setStreak(0);
    }

    // Check Badge Unlocks
    const updatedBadges = { ...badges };
    let badgeUnlocked = false;

    if (newScore >= 1 && !updatedBadges.novice.unlocked) {
      updatedBadges.novice.unlocked = true;
      badgeUnlocked = true;
    }
    if (newScore >= 3 && !updatedBadges.citizen.unlocked) {
      updatedBadges.citizen.unlocked = true;
      badgeUnlocked = true;
    }
    if (newScore === 5 && currentIdx === QUESTIONS.length - 1 && !updatedBadges.champion.unlocked) {
      updatedBadges.champion.unlocked = true;
      badgeUnlocked = true;
    }

    if (badgeUnlocked) {
      setBadges(updatedBadges);
      
      // Save unlocked badges to localStorage for profile display
      const currentUnlocked = [];
      if (updatedBadges.novice.unlocked) currentUnlocked.push('novice');
      if (updatedBadges.citizen.unlocked) currentUnlocked.push('citizen');
      if (updatedBadges.champion.unlocked) currentUnlocked.push('champion');
      localStorage.setItem('quiz_completed_badges', JSON.stringify(currentUnlocked));

      // Sync unlocked badges to backend database immediately
      const activeUser = JSON.parse(localStorage.getItem('drivelegal_active_user'));
      if (activeUser && activeUser.username) {
        currentUnlocked.forEach(badgeId => {
          fetch('http://localhost:3000/api/auth/add-badge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: activeUser.username,
              badgeId
            })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success && data.user) {
                localStorage.setItem('drivelegal_active_user', JSON.stringify(data.user));
              }
            })
            .catch(err => {
              console.log("Failed to sync badge to database:", err.message);
            });
        });
      }

      // Trigger badge celebration confetti
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 80,
          colors: ['#6366f1', '#06b6d4', '#10b981'],
          origin: { y: 0.6 }
        });
      }, 300);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setIsAnswered(false);

    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);

      // Sync quiz performance to persistent database if a user is logged in
      const activeUser = JSON.parse(localStorage.getItem('drivelegal_active_user'));
      if (activeUser && activeUser.username) {
        fetch('http://localhost:3000/api/auth/record-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: activeUser.username,
            score: score,
            streak: streak
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              // Sync updated user (with score & new badges) back to localStorage
              localStorage.setItem('drivelegal_active_user', JSON.stringify(data.user));
              
              // Also sync badges for the profile state
              localStorage.setItem('quiz_completed_badges', JSON.stringify(data.user.badges));
            }
          })
          .catch(err => {
            console.log("Failed to sync quiz session to backend database, keeping local storage:", err.message);
          });
      }

      // Big end confetti if they did well!
      if (score >= 3) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setStreak(0);
    setCompleted(false);
    
    // Reset badges
    setBadges({
      novice: { name: "Novice Driver", unlocked: false, desc: "Answer 1 question correctly" },
      citizen: { name: "Law-Abiding Citizen", unlocked: false, desc: "Answer 3 questions correctly" },
      champion: { name: "Road Safety Champion", unlocked: false, desc: "Get a perfect score of 5/5!" }
    });
  };

  const question = QUESTIONS[currentIdx];

  return (
    <div className="quiz-wrapper">
      {/* LEFT MAIN CARD */}
      <div className="glass-panel quiz-main-card">
        {!completed ? (
          <div style={{ width: '100%' }}>
            {/* Progress indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
              <span>Streak: {streak} 🔥</span>
            </div>
            
            <div className="quiz-progress-bar">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${((currentIdx) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Text */}
            <h2 className="quiz-question-txt">{question.question}</h2>

            {/* Options List */}
            <div className="quiz-options-list" style={{ margin: '0 auto' }}>
              {question.options.map((opt, idx) => {
                let btnClass = '';
                let icon = null;

                if (isAnswered) {
                  if (idx === question.answer) {
                    btnClass = 'correct';
                    icon = <CheckCircle size={18} />;
                  } else if (selectedOpt === idx) {
                    btnClass = 'incorrect';
                    icon = <XCircle size={18} />;
                  }
                }

                return (
                  <button 
                    key={idx}
                    className={`quiz-option-button ${btnClass}`}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered}
                  >
                    <span>{opt}</span>
                    {icon}
                  </button>
                );
              })}
            </div>

            {/* Explanations and Next controls */}
            {isAnswered && (
              <div style={{ margin: '0 auto', maxWidth: '600px' }}>
                <div className="quiz-explanation-box">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
                
                <button 
                  className="glow-btn glow-btn-teal" 
                  onClick={handleNext}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  {currentIdx === QUESTIONS.length - 1 ? "Finish Quiz & See Badges" : "Next Question →"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="quiz-logo-circle" style={{ margin: '0 auto 24px auto' }}>
              <Trophy size={40} />
            </div>
            
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Quiz Completed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              You scored <strong>{score} out of {QUESTIONS.length}</strong> points.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
              <div className="stat-item" style={{ padding: '16px' }}>
                <span className="stat-val">{score === 5 ? '🏆 Perfect Score!' : score >= 3 ? '👏 Safe Motorist' : '⚠️ Need Study'}</span>
                <span className="stat-lbl">Safety Standing Rating</span>
              </div>

              <button 
                className="glow-btn" 
                onClick={handleRestart}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT BADGES COLUMN */}
      <div className="badges-sidebar">
        {/* Score summaries */}
        <div className="glass-panel score-tracker-box">
          <span className="results-lbl">Live Stats</span>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-val">{score}</span>
              <span className="stat-lbl">Points</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">{streak}</span>
              <span className="stat-lbl">Current Streak</span>
            </div>
          </div>
        </div>

        {/* Dynamic collectible Badge widgets */}
        <div className="glass-panel badges-panel">
          <h2 className="receipt-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={14} style={{ color: 'var(--color-secondary)' }} />
            Driver Badge Closet
          </h2>
          
          <div className="badges-grid">
            {Object.entries(badges).map(([key, b]) => (
              <div 
                key={key} 
                className={`badge-card ${b.unlocked ? 'unlocked' : ''}`}
                title={b.desc}
              >
                <div className="badge-icon">
                  <Star size={20} fill={b.unlocked ? "var(--color-secondary)" : "none"} />
                </div>
                <span className="badge-name">{b.name}</span>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.2' }}>
                  {b.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
