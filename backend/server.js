import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CloudClient, ChromaClient } from 'chromadb';
import { analyzeQuery, applyQuantumStateCollapse } from './src/utils/nlpEngine.js';
import { dbService } from './src/utils/database.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const MOCK_VEHICLE_REGISTRY = {
  "TN-01-AB-1234": {
    plateNumber: "TN-01-AB-1234",
    owner: "Karthik Subramanian",
    vehicleModel: "Hyundai Creta (Polar White)",
    registrationDate: "2023-04-10",
    insuranceActive: true,
    pucValid: true,
    outstandingChallans: [
      { id: "CH-TN-88219", section: "Section 177 & MoRTH Rules", violation: "Non-HSRP Plate / Camera Misread in Chennai", fineAmount: 1000, points: 0, date: "2026-03-12" },
      { id: "CH-TN-90144", section: "Section 183(1) MVA", violation: "Speed Camera Flag (82 km/h in 60 zone)", fineAmount: 1000, points: 0, date: "2026-03-14" }
    ]
  },
  "DL-03-A-1234": {
    plateNumber: "DL-03-A-1234",
    owner: "Jane Doe",
    vehicleModel: "Tesla Model Y (Deep Blue Metallic)",
    registrationDate: "2024-03-12",
    insuranceActive: true,
    pucValid: true,
    outstandingChallans: [
      { id: "CH-90812", section: "184 MVA", violation: "Dangerous Driving in Delhi", fineAmount: 5000, points: 4, date: "2025-11-20" }
    ]
  },
  "CA-99A-4040": {
    plateNumber: "CA-99A-4040",
    owner: "Robert Chen",
    vehicleModel: "Ford F-150 Lightning (Carbonized Gray)",
    registrationDate: "2023-08-19",
    insuranceActive: true,
    pucValid: false,
    outstandingChallans: [
      { id: "CH-33120", section: "22350 CVC", violation: "Unsafe Speeding in Los Angeles", fineAmount: 238, points: 1, date: "2026-02-04" },
      { id: "CH-33155", section: "27153.5 CVC", violation: "Excessive Smoke/Emissions", fineAmount: 250, points: 0, date: "2026-04-10" }
    ]
  },
  "UK-LX-7777": {
    plateNumber: "UK-LX-7777",
    owner: "Sarah Jenkins",
    vehicleModel: "Jaguar I-PACE (Eiger Grey)",
    registrationDate: "2022-05-30",
    insuranceActive: true,
    pucValid: true,
    outstandingChallans: []
  }
};
function lookupVehicleRegistry(plateNumber) {
  if (!plateNumber) return { success: false, found: false, message: "No plate number provided." };
  const normalizedPlate = plateNumber.trim().toUpperCase().replace(/[\s-]/g, "");
  for (const [key, data] of Object.entries(MOCK_VEHICLE_REGISTRY)) {
    const normalizedKey = key.replace(/[\s-]/g, "");
    if (normalizedPlate.includes(normalizedKey) || normalizedKey.includes(normalizedPlate)) {
      return { success: true, found: true, data };
    }
  }
  return {
    success: true,
    found: false,
    message: `No registration record found for license plate: ${plateNumber}. Advise the user to verify the spacing or format.`
  };
}
app.use(cors());
app.use(express.json());
app.post("/api/auth/register", async (req, res) => {
  try {
    const { fullName, username, email, licenseNo, region, password } = req.body;
    if (!fullName || !username || !email || !licenseNo || !password) {
      return res.status(400).json({ success: false, message: "Missing required registration parameters." });
    }
    const existingUsername = dbService.findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ success: false, message: "Driver record with this username already exists." });
    }
    const existingEmail = dbService.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: "Driver record with this email already exists." });
    }
    const newUser = dbService.saveUser({
      fullName,
      username,
      email,
      licenseNo,
      region,
      password,
      safetyScore: 100,
      badges: []
    });
    res.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, username, email, licenseNo, region, password } = req.body;
    if (!fullName || !username || !email || !licenseNo || !password) {
      return res.status(400).json({ success: false, message: 'Missing required registration parameters.' });
    }
    const existingUsername = dbService.findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ success: false, message: 'Driver record with this username already exists.' });
    }
    const existingEmail = dbService.findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Driver record with this email already exists.' });
    }
    const newUser = dbService.saveUser({ fullName, username, email, licenseNo, region, password, safetyScore: 100, badges: [] });
    return res.json({ success: true, user: newUser });
  } catch (error) {
    console.error('Registration error (legacy /api/register):', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing username or password.' });
    }
    let user = dbService.findUserByUsername(username);
    if (!user) {
      user = dbService.findUserByEmail(username);
    }
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Identity access denied.' });
    }
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Authorization error (legacy /api/login):', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Missing username or password." });
    }
    let user = dbService.findUserByUsername(username);
    if (!user) {
      user = dbService.findUserByEmail(username);
    }
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials. Identity access denied." });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post("/api/auth/update-score", async (req, res) => {
  try {
    const { username, safetyScore } = req.body;
    if (!username || safetyScore === undefined) {
      return res.status(400).json({ success: false, message: "Missing username or safety score." });
    }
    const user = dbService.updateSafetyScore(username, safetyScore);
    if (!user) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Score update error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post("/api/auth/add-badge", async (req, res) => {
  try {
    const { username, badgeId } = req.body;
    if (!username || !badgeId) {
      return res.status(400).json({ success: false, message: "Missing username or badge id." });
    }
    const user = dbService.addBadge(username, badgeId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Badge unlock error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post("/api/auth/record-quiz", async (req, res) => {
  try {
    const { username, score, streak } = req.body;
    if (!username || score === undefined || streak === undefined) {
      return res.status(400).json({ success: false, message: "Missing required parameters." });
    }
    const user = dbService.recordQuizSession(username, score, streak);
    if (!user) {
      return res.status(404).json({ success: false, message: "Driver not found." });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Quiz recording error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// ENVIRONMENT & CREDENTIAL VALIDATION HELPERS
const isPlaceholder = (val) => {
  if (!val || typeof val !== 'string') return true;
  const trimmed = val.trim();
  return (
    trimmed === '' ||
    trimmed.startsWith('YOUR_') ||
    trimmed.includes('YOUR_CHROMA_API_KEY') ||
    trimmed.includes('YOUR_TENANT') ||
    trimmed.includes('YOUR_DATABASE') ||
    trimmed.includes('YOUR_HF_TOKEN')
  );
};

const isChromaConfigured = () => {
  return (
    !isPlaceholder(process.env.CHROMA_API_KEY) &&
    !isPlaceholder(process.env.CHROMA_TENANT) &&
    !isPlaceholder(process.env.CHROMA_DATABASE)
  );
};

const isLocalChroma = () => {
  return Boolean(process.env.CHROMA_URL || process.env.CHROMA_HOST);
};

const getHfToken = () => {
  return !isPlaceholder(process.env.HF_TOKEN) ? process.env.HF_TOKEN.trim() : null;
};
// CHROMADB CLIENT & COLLECTION SINGLETON (LAZY INITIALIZATION)
let chromaClient = null;
const getChromaClient = () => {
  if (chromaClient) return chromaClient;
  if (isChromaConfigured()) {
    chromaClient = new CloudClient({
      apiKey: process.env.CHROMA_API_KEY.trim(),
      tenant: process.env.CHROMA_TENANT.trim(),
      database: process.env.CHROMA_DATABASE.trim(),
    });
  } else if (isLocalChroma()) {
    chromaClient = new ChromaClient({
      path: process.env.CHROMA_URL || `http://${process.env.CHROMA_HOST || 'localhost'}:${process.env.CHROMA_PORT || 8000}`,
    });
  }
  return chromaClient;
};

let myCollection = null;
const getMyCollection = async () => {
  const client = getChromaClient();
  if (!client) return null;
  if (!myCollection) {
    myCollection = await client.getOrCreateCollection({
      name: "myCollection",
    });
  }
  return myCollection;
};

// CHROMADB & RAG ENDPOINTS
app.get("/api/health", async (req, res) => {
  try {
    if (!isChromaConfigured() && !isLocalChroma()) {
      return res.json({
        success: false,
        status: "disconnected",
        message: "ChromaDB Cloud credentials are unconfigured or set to placeholder values (YOUR_CHROMA_API_KEY_HERE) in backend/.env",
        collection: "myCollection",
        documentsCount: 0
      });
    }
    const client = getChromaClient();
    const clientInfo = await client.version();
    const collection = await getMyCollection();
    const count = collection ? await collection.count() : 0;
    res.json({
      success: true,
      status: "connected",
      version: clientInfo,
      collection: "myCollection",
      documentsCount: count
    });
  } catch (error) {
    console.warn("ChromaDB health check failed:", error.message);
    res.json({
      success: false,
      status: "disconnected",
      message: error.message,
      collection: "myCollection",
      documentsCount: 0
    });
  }
});

app.post("/api/add", async (req, res) => {
  try {
    if (!isChromaConfigured() && !isLocalChroma()) {
      return res.status(400).json({
        success: false,
        message: "ChromaDB credentials are not configured or still set to placeholder values in backend/.env."
      });
    }
    const { ids, documents, metadatas } = req.body;
    if (!ids || !documents) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: ids and documents are mandatory."
      });
    }
    const collection = await getMyCollection();
    if (!collection) {
      return res.status(500).json({
        success: false,
        message: "Unable to initialize ChromaDB collection."
      });
    }
    await collection.add({
      ids,
      documents,
      metadatas: metadatas || []
    });
    res.json({
      success: true,
      message: "Data added successfully",
      data: { ids, documents, metadatas }
    });
  } catch (error) {
    console.error("Failed to add data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add data",
      error: error.message
    });
  }
});

app.post("/api/query", async (req, res) => {
  try {
    if (!isChromaConfigured() && !isLocalChroma()) {
      return res.status(400).json({
        success: false,
        message: "ChromaDB is not configured or using placeholder credentials."
      });
    }
    const { queryText, nResults = 3, where } = req.body;
    if (!queryText) {
      return res.status(400).json({
        success: false,
        message: "Missing queryText field."
      });
    }
    const collection = await getMyCollection();
    if (!collection) {
      return res.status(500).json({
        success: false,
        message: "Unable to initialize ChromaDB collection."
      });
    }
    const results = await collection.query({
      queryTexts: [queryText], nResults, where
    });
    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Failed to query data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to query data",
      error: error.message
    });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, useChroma = true } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Missing message field." });
    }
    const hfToken = getHfToken();
    const plateMatch = message.toUpperCase().match(/\b((?:DL|CA|UK|TN)[-\s]?[0-9A-Z]{2,4}[-\s]?[A-Z0-9]{2,4}[-\s]?[0-9]{4})\b/);
    let targetPlate = null;
    if (message.toUpperCase().includes("TN-01-AB-1234") || message.toUpperCase().includes("TN01AB1234")) targetPlate = "TN-01-AB-1234";
    else if (message.toUpperCase().includes("DL-03-A-1234") || message.toUpperCase().includes("DL03A1234")) targetPlate = "DL-03-A-1234";
    else if (message.toUpperCase().includes("CA-99A-4040") || message.toUpperCase().includes("CA99A4040")) targetPlate = "CA-99A-4040";
    else if (message.toUpperCase().includes("UK-LX-7777") || message.toUpperCase().includes("UKLX7777")) targetPlate = "UK-LX-7777";
    else if (plateMatch) targetPlate = plateMatch[0];

    // If target license plate is detected and no active LLM key is configured, use instant deterministic offline registry lookup
    if (targetPlate && !hfToken) {
      const toolRes = lookupVehicleRegistry(targetPlate);
      if (toolRes.found) {
        const v = toolRes.data;
        const challansText = v.outstandingChallans.length > 0
          ? v.outstandingChallans.map(c => `* 📄 **Challan ID:** \`${c.id}\` | **Violation:** ${c.violation} | **Fine:** \`${c.fineAmount}\` | **Record Points:** \`${c.points}\``).join("\n")
          : "* ✅ **No active challans found on this vehicle profile.**";
        const localResponseText = `### 🔍 Verified Vehicle Registry Tool Output (Offline-First Grounded)
        Identified vehicle records for license plate **${v.plateNumber}** using the secure vehicle database:
        * 🚗 **Vehicle Model**: \`${v.vehicleModel}\`
        * 👤 **Owner Record**: **${v.owner}**
        * 📅 **Registration Date**: \`${v.registrationDate}\`
        * 🛡️ **Insurance Status**: ${v.insuranceActive ? "✅ **Active & Certified**" : "❌ **Expired / Uninsured**"}
        * 💨 **Emission Certificate (PUC)**: ${v.pucValid ? "✅ **Compliant**" : "❌ **Non-Compliant / Expired**"}
        **Outstanding Violations & Citation Dockets:** ${challansText}
        *Compliance Tip: Unpaid challans or expired emissions can lead to immediate license suspensions or vehicle impoundment.*`;
        return res.json({
          success: true, source: "Mock Agent Registry Tool (Offline-First)",
          responseText: localResponseText,
          suggestions: [
            "Speeding fine in California for car",
            "No seatbelt fine in Tamil Nadu",
            "Emergency numbers in United Kingdom",
            "Drunk driving limit in Scotland",
            "License renewal process in India",
            "Helmet law in Karnataka",
            "Traffic camera detection FAQ"
          ]
        });
      }
    }

    let groundingContext = "";
    let retrievedDoc = null;
    let distanceScore = null;
    if (targetPlate && hfToken) {
      const toolRes = lookupVehicleRegistry(targetPlate);
      if (toolRes.found) {
        const v = toolRes.data;
        const demeritsSymbol = v.outstandingChallans.length > 0 && v.outstandingChallans[0].points > 0 ? '$' : '₹';
        const challansText = v.outstandingChallans.length > 0
          ? v.outstandingChallans.map(c => `* Challan ID: ${c.id} | Violation: ${c.violation} | Fine: ${demeritsSymbol}${c.fineAmount} | Record Points: ${c.points}`).join("\n")
          : "No active outstanding challans on this profile.";
        const registryFactBlock = `[VERIFIED VEHICLE REGISTRY RECORD]:
Plate Number: ${v.plateNumber}
Owner Name: ${v.owner}
Vehicle Model: ${v.vehicleModel}
Registration Date: ${v.registrationDate}
Insurance Active: ${v.insuranceActive ? "YES" : "NO"}
Emission Certificate (PUC) Compliant: ${v.pucValid ? "YES" : "NO"}
Active Challans and Demerit Citations:
${challansText}`;
        groundingContext += registryFactBlock + "\n---\n";
      }
    }
    // Only attempt vector search if Chroma is actually configured
    if (useChroma && (isChromaConfigured() || isLocalChroma())) {
      try {
        const collection = await getMyCollection();
        if (collection) {
          const chromaResults = await collection.query({
            queryTexts: [message],
            nResults: 2
          });
          if (chromaResults.documents && chromaResults.documents[0] && chromaResults.documents[0].length > 0) {
            const candidateDoc = chromaResults.documents[0][0];
            distanceScore = chromaResults.distances ? chromaResults.distances[0][0] : null;
            // Only accept if semantic distance score indicates relevance and not a dummy test doc
            if ((distanceScore === null || distanceScore < 1.45) && !candidateDoc.includes("Hello Chroma")) {
              retrievedDoc = candidateDoc;
              groundingContext += chromaResults.documents[0].filter(d => !d.includes("Hello Chroma")).join("\n---\n");
            }
          }
        }
      } catch (chromaError) {
        console.warn("Vector search failed, continuing without context:", chromaError.message);
      }
    }

    // Only attempt Hugging Face synthesis if a valid (non-placeholder) token is configured
    if (hfToken) {
      try {
        const systemPrompt = `SYSTEM INSTRUCTION: You are DriveLegal, an AI road safety and legal compliance assistant. You are powered by a high-performance grounded intelligence system designed to completely eliminate hallucinations.
You must answer the user's question based strictly on the retrieved vector search facts or vehicle registry data provided below.
If the retrieved facts or vehicle data do not contain the answer, politely respond that you do not have record of that specific road rule or license plate in your database.
Under no circumstances should you hallucinate, guess, or invent points, fines, speed limits, or section codes.
Keep your response professional, precise, and formatted in clean markdown.

RETRIEVED VECTOR FACTS / REGISTRY DATA:
${groundingContext ? groundingContext : "NO SEMANTIC MATCHES FOUND. Warn the user that offline-first static lookups must be used."}`;

        const modelId = process.env.HF_MODEL || "Qwen/Qwen2.5-72B-Instruct";
        const hfUrl = `https://api-inference.huggingface.co/v1/chat/completions`;

        let hfResponse = await fetch(hfUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${hfToken}`
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message }
            ],
            temperature: 0.1,
            max_tokens: 1024
          })
        });

        let hfData = await hfResponse.json();
        if (hfData.choices && hfData.choices[0] && hfData.choices[0].message) {
          const rawSynthesizedText = hfData.choices[0].message.content;
          const collapsedText = applyQuantumStateCollapse(rawSynthesizedText, groundingContext);
          return res.json({
            success: true,
            source: `Hugging Face Grounded LLM (${modelId})`,
            responseText: collapsedText,
            distance: distanceScore,
            suggestions: [
              "Speeding fine in California for car",
              "No seatbelt fine in Tamil Nadu",
              "Emergency numbers in United Kingdom",
              "Drunk driving limit in Scotland",
              "License renewal process in India",
              "Helmet law in Karnataka",
              "Traffic camera detection FAQ"
            ]
          });
        } else if (hfData.error) {
          console.error("Hugging Face API returned error details:", hfData.error);
        }
      } catch (hfError) {
        console.error("Hugging Face Inference API generation failed:", hfError.message);
      }
    }

    // Evaluate query through deterministic statutory NLP engine
    const localNlpResult = analyzeQuery(message);

    // 1. Emergency intent check (emergency numbers, accident protocols, roadside hotlines)
    if (localNlpResult && localNlpResult.intent === 'emergency') {
      return res.json({
        success: true, source: "Emergency Roadside Protocol (Deterministic Grounding)",
        responseText: localNlpResult.responseText,
        suggestions: [
          "Emergency numbers in United Kingdom",
          "Police hotline in California",
          "Ambulance number in Delhi",
          "Speeding fine in California for car",
          "No seatbelt fine in Tamil Nadu"
        ]
      });
    }

    // 2. Direct rule match if LLM key is pending
    if (!hfToken && localNlpResult && localNlpResult.ruleMatched) {
      return res.json({
        success: true,
        source: "Deterministic Statutory Rules Engine",
        responseText: localNlpResult.responseText,
        ruleMatched: localNlpResult.ruleMatched,
        suggestions: [
          "Speeding fine in California for car",
          "No seatbelt fine in Tamil Nadu",
          "Emergency numbers in United Kingdom",
          "Drunk driving limit in Scotland",
          "License renewal process in India",
          "Helmet law in Karnataka",
          "Traffic camera detection FAQ"
        ]
      });
    }

    // Direct match from Chroma if LLM token is unconfigured
    if (retrievedDoc && !retrievedDoc.includes('Hello Chroma')) {
      const lines = retrievedDoc.split('\n');
      let title = "Statutory Regulatory Match";
      let section = "";
      let fine = "";
      let details = "";
      lines.forEach(l => {
        if (l.startsWith("Official Title:")) title = l.replace("Official Title:", "").trim();
        if (l.startsWith("Legal Statutory Citation:")) section = l.replace("Legal Statutory Citation:", "").trim();
        if (l.startsWith("Base Fine Penalty:")) fine = l.replace("Base Fine Penalty:", "").trim();
        if (l.startsWith("Detailed Provision:")) details = l.replace("Detailed Provision:", "").trim();
      });

      const formattedResponse = title !== "Statutory Regulatory Match"
        ? `### 🛡️ DriveLegal AI Analysis: ${title}\n\nBased on statutory regulations under the **Motor Vehicles Act (India)**:\n* ⚖️ **Legal Citation:** \`${section}\`\n* 💵 **Standard Compounding Fine:** **${fine}**\n\n**Statutory Provision & Enforcement:**\n${details || retrievedDoc}\n\n*Compliance Tip: Keep your credentials updated via DigiLocker or mParivahan to avoid compound penalties.*`
        : `### 🛡️ DriveLegal Verified Legal Guideline\n\n${retrievedDoc}`;

      return res.json({
        success: true,
        source: "ChromaDB Semantic Engine",
        responseText: formattedResponse,
        distance: distanceScore,
        suggestions: [
          "Is DigiLocker valid for police check?",
          "Can police snatch vehicle keys?",
          "How to dispute a wrong challan online?",
          "Over-speeding fine in Delhi",
          "What is the penalty for underage driving?"
        ]
      });
    }

    // Deterministic offline statutory NLP engine fallback for any other general query
    if (localNlpResult && localNlpResult.responseText) {
      return res.json({
        success: true,
        source: "Offline-First Statutory NLP Engine",
        responseText: localNlpResult.responseText,
        ruleMatched: localNlpResult.ruleMatched,
        suggestions: [
          "Is DigiLocker valid for police check?",
          "Can police snatch vehicle keys?",
          "How to dispute a wrong challan online?",
          "Over-speeding fine in Delhi",
          "What is the penalty for underage driving?"
        ]
      });
    }

    return res.json({
      success: false,
      message: "No database records matched this query. Using local offline rule-engine."
    });
  } catch (error) {
    console.error("Grounded chat generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.info(`DriveLegal Middleware Server running on port ${PORT}`);
  console.info(`ChromaDB Cloud: ${isChromaConfigured() ? 'Configured' : isLocalChroma() ? 'Local Instance' : 'Unconfigured/Placeholder (Using offline rules)'}`);
  console.info(`Hugging Face:  ${getHfToken() ? 'Configured' : 'Unconfigured/Placeholder (Using deterministic engine)'}`);
});
