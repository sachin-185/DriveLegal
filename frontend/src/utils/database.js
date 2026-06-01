import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'database.json');

// Initialize database file if it does not exist
function initDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = {
        users: [],
        quiz_history: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

// Read database contents
function readDb() {
  initDb();
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error("Failed to read database, returning empty collections:", error);
    return { users: [], quiz_history: [] };
  }
}

// Write database contents safely
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Failed to write to database:", error);
    return false;
  }
}

export const dbService = {
  // Find a user by username
  findUserByUsername(username) {
    if (!username) return null;
    const db = readDb();
    return db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase()) || null;
  },

  // Find a user by email
  findUserByEmail(email) {
    if (!email) return null;
    const db = readDb();
    return db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  },

  // Register or save a new user
  saveUser(userData) {
    const db = readDb();
    const existingIdx = db.users.findIndex(u => u.username.toLowerCase() === userData.username.toLowerCase());
    
    const formattedUser = {
      id: userData.id || 'DL-' + Math.floor(100000 + Math.random() * 900000),
      fullName: userData.fullName.trim(),
      username: userData.username.trim(),
      email: userData.email.trim(),
      licenseNo: userData.licenseNo.trim().toUpperCase(),
      region: userData.region || 'IN',
      password: userData.password, // Standard password for local auth
      safetyScore: userData.safetyScore !== undefined ? userData.safetyScore : 100,
      badges: userData.badges || [],
      registeredAt: userData.registeredAt || new Date().toISOString()
    };

    if (existingIdx !== -1) {
      db.users[existingIdx] = { ...db.users[existingIdx], ...formattedUser };
    } else {
      db.users.push(formattedUser);
    }

    writeDb(db);
    return formattedUser;
  },

  // Update a user's driver safety score
  updateSafetyScore(username, newScore) {
    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      user.safetyScore = Math.max(0, Math.min(100, newScore));
      writeDb(db);
      return user;
    }
    return null;
  },

  // Unlock and add a driver badge
  addBadge(username, badgeId) {
    const db = readDb();
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      if (!user.badges.includes(badgeId)) {
        user.badges.push(badgeId);
        writeDb(db);
      }
      return user;
    }
    return null;
  },

  // Record a quiz session completed by the driver
  recordQuizSession(username, score, streak) {
    const db = readDb();
    const session = {
      username,
      score,
      streak,
      timestamp: new Date().toISOString()
    };
    db.quiz_history.push(session);

    // Sync safety score and auto-unlock badges based on quiz performance
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
      // Unlocks: novice for >=1 point, citizen for >=3, champion for 5
      const currentBadges = user.badges || [];
      if (score >= 1 && !currentBadges.includes('novice')) currentBadges.push('novice');
      if (score >= 3 && !currentBadges.includes('citizen')) currentBadges.push('citizen');
      if (score === 5 && !currentBadges.includes('champion')) currentBadges.push('champion');
      user.badges = currentBadges;

      // Quiz completion boosts safety score slightly
      user.safetyScore = Math.min(100, user.safetyScore + score);
    }

    writeDb(db);
    return user || null;
  }
};
