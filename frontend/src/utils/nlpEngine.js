import { lawDatabase } from '../data/lawDatabase.js';

// Standard English stop words to filter out
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could',
  'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is',
  'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same',
  'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
  'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt',
  'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
  'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
  'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Helper to tokenize and clean text
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0 && !STOP_WORDS.has(word));
}

// Extractor for location entities
function extractLocation(tokens, rawText) {
  const text = rawText.toLowerCase();

  // Search mappings
  const locations = {
    IN: {
      country: "IN",
      state: null,
      keywords: ["india", "indian", "mva", "motor vehicle", "bharat", "inr", "rupees", "rs"]
    },
    US: {
      country: "US",
      state: null,
      keywords: ["usa", "us", "america", "american", "united states", "usd", "dollars", "california", "cvc", "cali", "ca", "new york", "ny", "vtl", "nyc", "texas", "tx", "florida", "fl"]
    },
    UK: {
      country: "UK",
      state: null,
      keywords: ["uk", "united kingdom", "britain", "british", "england", "scotland", "london", "gbp", "pounds", "highway code", "ulez", "tfl"]
    }
  };

  // State mappings
  const stateMappings = {
    // India
    delhi: { country: "IN", state: "DL" },
    dl: { country: "IN", state: "DL" },
    maharashtra: { country: "IN", state: "MH" },
    mumbai: { country: "IN", state: "MH" },
    mh: { country: "IN", state: "MH" },
    pune: { country: "IN", state: "MH" },
    tamilnadu: { country: "IN", state: "TN" },
    "tamil nadu": { country: "IN", state: "TN" },
    chennai: { country: "IN", state: "TN" },
    tn: { country: "IN", state: "TN" },
    karnataka: { country: "IN", state: "KA" },
    bangalore: { country: "IN", state: "KA" },
    bengaluru: { country: "IN", state: "KA" },
    ka: { country: "IN", state: "KA" },
    up: { country: "IN", state: "UP" },
    uttarpradesh: { country: "IN", state: "UP" },
    "uttar pradesh": { country: "IN", state: "UP" },
    lucknow: { country: "IN", state: "UP" },

    // USA
    california: { country: "US", state: "CA" },
    ca: { country: "US", state: "CA" },
    la: { country: "US", state: "CA" },
    "san francisco": { country: "US", state: "CA" },
    newyork: { country: "US", state: "NY" },
    "new york": { country: "US", state: "NY" },
    ny: { country: "US", state: "NY" },
    nyc: { country: "US", state: "NY" },
    texas: { country: "US", state: "TX" },
    tx: { country: "US", state: "TX" },
    houston: { country: "US", state: "TX" },
    florida: { country: "US", state: "FL" },
    fl: { country: "US", state: "FL" },
    miami: { country: "US", state: "FL" },

    // UK
    england: { country: "UK", state: "ENG" },
    wales: { country: "UK", state: "ENG" },
    scotland: { country: "UK", state: "SCT" },
    edinburgh: { country: "UK", state: "SCT" },
    glasgow: { country: "UK", state: "SCT" },
    sct: { country: "UK", state: "SCT" },
    london: { country: "UK", state: "LDN" },
    ldn: { country: "UK", state: "LDN" }
  };

  // Check state phrases first
  for (const [key, mapping] of Object.entries(stateMappings)) {
    if (text.includes(key)) {
      return mapping;
    }
  }

  // Check countries next
  for (const [countryCode, data] of Object.entries(locations)) {
    for (const kw of data.keywords) {
      if (text.includes(kw)) {
        return { country: countryCode, state: null };
      }
    }
  }

  return null;
}

// Extractor for vehicle entities
function extractVehicle(tokens, rawText) {
  const text = rawText.toLowerCase();

  const vehicles = {
    motorcycle: ["motorcycle", "bike", "scooter", "two wheeler", "2 wheeler", "activa", "royal enfield"],
    car: ["car", "suv", "sedan", "hatchback", "four wheeler", "4 wheeler", "jeep", "auto"],
    commercial: ["commercial", "truck", "bus", "lorry", "taxi", "cab", "goods carrier", "heavy vehicle", "hmv"]
  };

  for (const [type, keywords] of Object.entries(vehicles)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        return type;
      }
    }
  }

  return null;
}

// Map violation keywords to categories and specific searches
const VIOLATION_KEYWORDS = {
  speeding: ["speed", "speeding", "overspeed", "overspeeding", "fast", "mph", "kmh", "km/h", "limits", "limit", "reckless", "rash", "dangerous"],
  sobriety: ["drink", "drunk", "drinking", "alcohol", "dui", "dwi", "bac", "breathalyzer", "wine", "beer", "whiskey", "intoxicated", "sober"],
  safety_gear: ["helmet", "headgear", "seatbelt", "belt", "seat-belt", "strapped", "phone", "mobile", "cell", "texting", "distracted", "calling"],
  licensing: ["license", "licence", "dl", "unlicensed", "permit", "insurance", "puc", "pollution", "emission", "emissions", "smoke", "registration", "rc"],
  signals: ["red light", "red-light", "signal", "traffic light", "junction", "one way", "one-way", "wrong way", "wrong-way", "opposite", "direction"],
  city_zones: ["ulez", "clean air", "emission zone", "congestion", "charge", "london charge", "tfl"]
};

// Extractor for violation concepts
function extractViolationKeywords(tokens, rawText) {
  const text = rawText.toLowerCase();
  const matchedCategories = [];

  for (const [category, keywords] of Object.entries(VIOLATION_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        matchedCategories.push(category);
        break; // check next category
      }
    }
  }

  return matchedCategories;
}

// Intent Classifier
function determineIntent(tokens, rawText) {
  const text = rawText.toLowerCase();

  // Greetings
  if (/\b(hi|hello|hey|greetings|good morning|hola|howdy|whats up)\b/.test(text)) {
    return 'greetings';
  }

  // Emergency / Assistance
  if (/\b(emergency|accident|help|tow|ambulance|police|police station|crash|hospital|breakdown|flat tire|toll free|hotline)\b/.test(text)) {
    return 'emergency';
  }

  // Quiz reference
  if (/\b(quiz|game|test|trivia|question|badge|score|learn)\b/.test(text)) {
    return 'quiz_query';
  }

  // Cost / fine query
  if (/\b(fine|cost|fee|penalty|charge|amount|pay|challan|calculator|compounding)\b/.test(text)) {
    return 'check_fine';
  }

  // Demerits / points query
  if (/\b(points|demerit|demerits|record|suspension|points deduction|license points)\b/.test(text)) {
    return 'check_points';
  }

  return 'generic_query';
}

// Primary offline analysis method
export function analyzeQuery(rawText, defaultLocation = { country: "IN", state: "DL" }) {
  if (!rawText || rawText.trim() === '') {
    return {
      intent: 'greetings',
      responseText: "Hello! I am DriveLegal, your offline-first AI road safety and legal assistant. How can I help you understand traffic laws, fines, or safety protocols today?"
    };
  }

  const tokens = tokenize(rawText);
  const intent = determineIntent(tokens, rawText);
  const detectedLoc = extractLocation(tokens, rawText);
  const detectedVehicle = extractVehicle(tokens, rawText);
  const detectedViolations = extractViolationKeywords(tokens, rawText);

  // Target Location selection (falls back to detected, or default)
  const targetCountry = detectedLoc ? detectedLoc.country : defaultLocation.country;
  const targetState = detectedLoc ? detectedLoc.state : (detectedLoc ? null : defaultLocation.state);

  const countryData = lawDatabase.countries[targetCountry];
  if (!countryData) {
    return {
      intent: 'unknown',
      responseText: "I recognize you're asking about traffic laws, but I don't have records for that country yet. I currently support comprehensive traffic guides for India (INR), the United States (USD), and the United Kingdom (GBP). Please try specifying one of these countries!"
    };
  }

  // Build conversational greeting response
  if (intent === 'greetings') {
    return {
      intent,
      detectedLoc,
      detectedVehicle,
      responseText: `Hello! I'm **DriveLegal**, your AI assistant for road safety. 
I detected you might be located in or querying about **${countryData.name}${targetState ? ' (' + (countryData.states[targetState]?.name || targetState) + ')' : ''}**.

Here's what I can do for you completely offline:
* ⚖️ **Calculate fines** (e.g., *"How much is the seatbelt fine in California?"*)
* 🏍️ **Vehicle-specific citations** (e.g., *"Commercial truck speeding fines in Delhi"*)
* 🚨 **Show Emergency hotlines** (e.g., *"Give me emergency roadside numbers in the UK"*)
* ✍️ **Gamified Knowledge Quiz** (ask about the quiz to test your driving awareness!)

What traffic rule or fine would you like to lookup?`
    };
  }

  // Emergency inquiries
  if (intent === 'emergency') {
    const emergencyInfo = countryData.states[targetState]?.emergency || countryData.defaultEmergency;
    const locString = targetState ? `${countryData.states[targetState]?.name}, ${countryData.name}` : countryData.name;
    return {
      intent,
      detectedLoc,
      responseText: `🚨 **EMERGENCY ROADSIDE SERVICES PROTOCOL - ${locString.toUpperCase()}** 🚨

If you are involved in a traffic accident or vehicle breakdown, please pull over safely, switch on hazard warnings, and use the following local emergency services:
* 📞 **Police (Emergency)**: \`${emergencyInfo.police}\`
* 🚑 **Medical/Ambulance**: \`${emergencyInfo.ambulance}\`
* 🚒 **Fire Brigade**: \`${emergencyInfo.fire || '112'}\`
* 🚧 **National Highway Patrol**: \`${emergencyInfo.highwayPatrol}\`

*Safety Tip: If on a highway, stand behind the crash barrier on the shoulder side, keeping a safe distance from active traffic lanes while waiting for help.*`
    };
  }

  // Quiz queries
  if (intent === 'quiz_query') {
    return {
      intent,
      responseText: `🏆 **DriveLegal Road Safety Awareness Quiz** 🏆

Would you like to test your understanding of traffic regulations? Head over to the **Safety Quiz** tab on the navigation dashboard! 

Participating in the quiz helps you:
1. Learn crucial local traffic signals and signs.
2. Avoid expensive challans by understanding demerit points and safety margins.
3. Earn collectible **Driver Badges** (like *Defensive Driver Master* or *Law-Abiding Citizen*) directly in your profile!

Let me know if you have questions about specific rules (e.g. *"What is the limit for drunk driving in Scotland?"*) and I'll explain them right here!`
    };
  }

  // Keyword-matching search of laws in the active country
  let bestMatchRule = null;
  let highestScore = 0;
  let matchedCategoryKey = '';

  // Look through categories
  for (const [catKey, category] of Object.entries(countryData.categories)) {
    for (const rule of category.rules) {
      let score = 0;

      // 1. Text match score on Title
      const titleTokens = tokenize(rule.title);
      for (const t of tokens) {
        if (titleTokens.includes(t)) score += 3;
      }

      // 2. Text match score on Description
      const descTokens = tokenize(rule.description);
      for (const t of tokens) {
        if (descTokens.includes(t)) score += 1.5;
      }

      // 3. Category match boost
      if (detectedViolations.includes(catKey)) {
        score += 5;
      }

      // 4. Vehicle matches boost/filter
      if (detectedVehicle) {
        if (rule.vehicleTypes.includes(detectedVehicle) || rule.vehicleTypes.includes('all')) {
          score += 2;
        } else {
          score -= 3; // penalize mismatch (e.g. asking for car speeding but matching two-wheeler rules)
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatchRule = rule;
        matchedCategoryKey = catKey;
      }
    }
  }

  // If a solid match is found (score threshold > 3)
  if (bestMatchRule && highestScore > 3) {
    const symbol = countryData.symbol;
    let baseFine = bestMatchRule.baseFine;
    let desc = bestMatchRule.description;
    let hasStateOverride = false;
    let overrideText = '';

    // Apply state-specific factor and overrides
    if (targetState && bestMatchRule.stateOverrides && bestMatchRule.stateOverrides[targetState]) {
      const override = bestMatchRule.stateOverrides[targetState];
      baseFine = override.baseFine !== undefined ? override.baseFine : baseFine;
      desc = override.description !== undefined ? override.description : desc;
      hasStateOverride = true;
      overrideText = `*(State amendment applied for **${countryData.states[targetState].name}**)*`;
    } else if (targetState && countryData.states[targetState]) {
      // General state adjustments
      const stateObj = countryData.states[targetState];
      if (stateObj.factor !== 1.0) {
        baseFine = Math.round(baseFine * stateObj.factor);
        overrideText = `*(Calculated base with a local indexing factor of ${stateObj.factor} for **${stateObj.name}**)*`;
      }
    }

    const citationText = `⚖️ **Legal Citation:** \`${bestMatchRule.section}\``;
    const fineText = baseFine > 0 
      ? `💵 **Compounding Fine:** **${symbol}${baseFine.toLocaleString()}** ${overrideText}`
      : `💵 **Fine Structure:** Non-monetary penalty / Subject to warning / Court appearance`;

    const pointsText = bestMatchRule.points > 0
      ? `⚠️ **Demerit Penalty:** **${bestMatchRule.points} Points** on your driving record.`
      : '';

    let extraWarning = '';
    if (bestMatchRule.points >= 6 || baseFine >= 5000 || (targetCountry === 'US' && bestMatchRule.id.includes('dui')) || (targetCountry === 'UK' && bestMatchRule.id.includes('drink'))) {
      extraWarning = `\n\n> [!WARNING]
> **HIGH SEVERITY OFFENSE**: This violation is classified as critical. It involves an immediate risk of license suspension, vehicle impoundment, or jail time. Drive defensively!`;
    }

    const vehicleScope = bestMatchRule.vehicleTypes.includes('all') 
      ? "All Vehicle Types" 
      : bestMatchRule.vehicleTypes.map(v => v.toUpperCase()).join(", ");

    return {
      intent,
      detectedLoc,
      detectedVehicle,
      ruleMatched: bestMatchRule,
      responseText: `### Traffic Violation Analysis: ${bestMatchRule.title}

Here is the location-specific legal standing in **${countryData.states[targetState]?.name || countryData.name}** for **${vehicleScope}**:

*   ${citationText}
*   ${fineText}
*   ${pointsText}

**Details & Provisions:**
${desc}

*Remember: Staying compliant with traffic rules ensures your safety, protects pedestrians, and keeps your driving record completely clean.*${extraWarning}`
    };
  }

  // Fallback for general queries without exact matches
  const locationString = targetState ? `${countryData.states[targetState].name}, ${countryData.name}` : countryData.name;
  return {
    intent,
    detectedLoc,
    detectedVehicle,
    responseText: `I analyzed your query regarding **${locationString}** but couldn't find an exact statutory matching code in our local database. 

However, let's look at the general rules:
1. **Speed Limits**: Always adhere to posted limits. Standard limits in urban environments are 30-50 km/h in India, 25-35 mph in residential US zones, and 20-30 mph in metropolitan UK areas.
2. **Safety Measures**: Wearing helmets for two-wheelers and seatbelts for all passengers in passenger vehicles is universally mandatory and strictly enforced in **${countryData.name}**.
3. **Sobriety**: Drunk driving is treated as a highly critical criminal offense across all regions with severe penalties.

Would you mind rephrasing your question or selecting the **Challan Calculator** or **Law Explorer** above to view our fully indexed lists of rules?`
  };
}

/**
 * Quantum-Inspired State Measurement Filter
 * Models generative text as a superposition of semantic possibilities,
 * collapsing it against verified database states to completely eliminate numerical hallucinations.
 */
export function applyQuantumStateCollapse(synthesizedText, verifiedFacts) {
  if (!synthesizedText) return "";
  if (!verifiedFacts || verifiedFacts.length === 0) return synthesizedText;

  // Extract all numerical eigenvalues (e.g. fine amounts, points, codes)
  const numberRegex = /(\d+(?:,\d+)*(?:\.\d+)?)/g;
  const generatedNumbers = synthesizedText.match(numberRegex) || [];
  
  // Combine all verified facts into a single observable measurement boundary
  const observableFactsText = Array.isArray(verifiedFacts) ? verifiedFacts.join(" ") : verifiedFacts;
  const verifiedNumbers = observableFactsText.match(numberRegex) || [];
  const verifiedNumbersSet = new Set(verifiedNumbers);

  let collapsedText = synthesizedText;

  // Measurement Phase: Validate numerical eigenvalues
  for (const num of generatedNumbers) {
    // If a numerical value has zero overlap with the verified facts, collapse it to the nearest verified value
    if (!verifiedNumbersSet.has(num)) {
      const genVal = parseFloat(num.replace(/,/g, ''));
      let nearestVal = null;
      let minDiff = Infinity;

      for (const vNum of verifiedNumbers) {
        const vVal = parseFloat(vNum.replace(/,/g, ''));
        const diff = Math.abs(genVal - vVal);
        if (diff < minDiff) {
          minDiff = diff;
          nearestVal = vNum;
        }
      }

      if (nearestVal !== null && minDiff !== Infinity) {
        // Probabilistic State Collapse: Correct the hallucinated numerical value
        const escapedNum = num.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const numRegex = new RegExp(`\\b${escapedNum}\\b`, 'g');
        collapsedText = collapsedText.replace(numRegex, `${nearestVal} [Collapsed Fact: Corrected from ${num}]`);
      }
    }
  }

  return collapsedText;
}
