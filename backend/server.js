import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CloudClient } from 'chromadb';
import { applyQuantumStateCollapse } from './src/utils/nlpEngine.js';
import { dbService } from './src/utils/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// MOCK EXTERNAL VEHICLE REGISTRY FOR AGENTIC TOOL USE
// ==========================================
const MOCK_VEHICLE_REGISTRY = {
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
    pucValid: false, // Expired emission
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
    outstandingChallans: [] // Perfect clean record
  }
};

function lookupVehicleRegistry(plateNumber) {
  if (!plateNumber) return { success: false, found: false, message: "No plate number provided." };
  
  const normalizedPlate = plateNumber.trim().toUpperCase().replace(/[\s-]/g, "");
  
  // Search with loose parsing
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

// ==========================================
// PERSISTENT USER & LEGAL AUDIT DATABASE ENDPOINTS
// ==========================================

// Register driver
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

// ================================
// Compatibility aliases for older UI URLs
// ================================
// These endpoints forward to the newer /api/auth/* routes so existing fetch calls keep working.
app.post('/api/register', async (req, res) => {
  // Re-use the same logic as /api/auth/register
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
  // Re-use the same logic as /api/auth/login
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

// Authorize driver
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

// Update safety score
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

// Unlock badge
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

// Record quiz session and sync badges
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

// Initialize Chroma Cloud Client
const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

let myCollection = null;
const getMyCollection = async () => {
  if (!myCollection) {
    myCollection = await chromaClient.getOrCreateCollection({
      name: "myCollection",
    });
  }
  return myCollection;
};

// Healthcheck endpoint
app.get("/api/health", async (req, res) => {
  try {
    const clientInfo = await chromaClient.version();
    const collection = await getMyCollection();
    const count = await collection.count();
    res.json({
      success: true,
      status: "connected",
      version: clientInfo,
      collection: "myCollection",
      documentsCount: count
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      success: false,
      status: "disconnected",
      message: error.message
    });
  }
});

// POST endpoint to add data
app.post("/api/add", async (req, res) => {
  try {
    const { ids, documents, metadatas } = req.body;
    
    if (!ids || !documents) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: ids and documents are mandatory."
      });
    }

    const collection = await getMyCollection();

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

// POST endpoint to query data
app.post("/api/query", async (req, res) => {
  try {
    const { queryText, nResults = 3, where } = req.body;

    if (!queryText) {
      return res.status(400).json({
        success: false,
        message: "Missing queryText field."
      });
    }

    const collection = await getMyCollection();
    const results = await collection.query({
      queryTexts: [queryText],
      nResults,
      where
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

// POST endpoint for high-performance grounded AI chat (RAG + Hugging Face Qwen 2.5 + Agentic Pre-fetching)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, useChroma = true } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Missing message field." });
    }

    const hfToken = process.env.HF_TOKEN;

    // A. Detect if the message contains a vehicle lookup command or plate number for offline testing
    const plateMatch = message.toUpperCase().match(/\b((?:DL|CA|UK)[-\s]?[0-9A-Z]{2,4}[-\s]?[A-Z0-9]{2,4}[-\s]?[0-9]{4})\b/);
    let targetPlate = null;
    if (message.toUpperCase().includes("DL-03-A-1234") || message.toUpperCase().includes("DL03A1234")) targetPlate = "DL-03-A-1234";
    else if (message.toUpperCase().includes("CA-99A-4040") || message.toUpperCase().includes("CA99A4040")) targetPlate = "CA-99A-4040";
    else if (message.toUpperCase().includes("UK-LX-7777") || message.toUpperCase().includes("UKLX7777")) targetPlate = "UK-LX-7777";
    else if (plateMatch) targetPlate = plateMatch[0];

    // If Hugging Face token is missing and a plate is matched, return the offline registry template immediately
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

**Outstanding Violations & Citation Dockets:**
${challansText}

*Compliance Tip: Unpaid challans or expired emissions can lead to immediate license suspensions or vehicle impoundment.*`;

        return res.json({
          success: true,
          source: "Mock Agent Registry Tool (Offline-First)",
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

    // 1. Pre-fetch vehicle registry details if plate is matched and token is available
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

    // 2. Retrieve from ChromaDB RAG Vector Store if active
    if (useChroma) {
      try {
        const collection = await getMyCollection();
        const chromaResults = await collection.query({
          queryTexts: [message],
          nResults: 2
        });

        if (chromaResults.documents && chromaResults.documents[0] && chromaResults.documents[0].length > 0) {
          retrievedDoc = chromaResults.documents[0][0];
          distanceScore = chromaResults.distances ? chromaResults.distances[0][0] : null;
          
          // Only use RAG facts if semantic distance is within reasonable limit (e.g. 1.45)
          if (distanceScore === null || distanceScore < 1.45) {
            groundingContext += chromaResults.documents[0].join("\n---\n");
          }
        }
      } catch (chromaError) {
        console.error("Vector search failed, continuing without context:", chromaError.message);
      }
    }

    // 3. Synthesize using Hugging Face Serverless Inference API if token is available
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

    // 4. Fallback: If no HF Token is set, or request fails, return the structured RAG record directly
    if (retrievedDoc) {
      return res.json({
            success: true,
            source: "ChromaDB Direct Match (LLM Key Pending)",
            responseText: `### ⚡ ChromaDB Semantic Match\n\n**Retrieved Legal Guideline:**\n${retrievedDoc}\n\n*Note: To synthesize conversational responses, please add ` + "`HF_TOKEN`" + ` in your backend ` + ".env" + ` configuration.*`,
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
    }

    // 5. Ultimate Fallback: Return empty so client uses local offline analyzer (nlpEngine)
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
  console.log(`ChromaDB middleware Express server running on port ${PORT}`);
});
