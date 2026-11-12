import { lawDatabase } from '../data/lawDatabase.js';

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

export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0 && !STOP_WORDS.has(word));
}

function extractLocation(tokens, rawText) {
  const text = rawText.toLowerCase();
  const stateMappings = {
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
    ncr: { country: "IN", state: "DL" }
  };

  for (const [key, mapping] of Object.entries(stateMappings)) {
    if (text.includes(key)) {
      return mapping;
    }
  }

  return { country: "IN", state: "DL" };
}

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

// Comprehensive Traffic & Legal Knowledge Base
const LEGAL_INTENT_PATTERNS = [
  {
    id: "tn_hsrp_guidelines",
    patterns: [/hsrp/i, /high security/i, /number plate/i, /snap lock/i, /windshield sticker/i, /third registration sticker/i, /fancy plate/i, /bookmyhsrp/i],
    response: `### 🛡️ High-Security Registration Plate (HSRP) Rules in Tamil Nadu

Under **MoRTH statutory guidelines** and the **Amended Motor Vehicles Act**:

* 🔒 **Mandatory Tamper-Proof Standards**: Every vehicle registered in Tamil Nadu must display an HSRP plate equipped with non-removable snap locks, laser-etched 10-digit PIN, and a Chromium Ashoka Chakra hologram.
* 🎨 **Color-Coded Plates by Vehicle Type**:
  * ⚪ **Private Petrol/Diesel/CNG**: White background with black lettering.
  * 🟡 **Commercial (Taxis, Trucks, Buses)**: Yellow background with black lettering.
  * 🟢 **Electric Vehicles (EVs)**: Green background with white/yellow lettering.
* 🏷️ **Fuel-Type Windshield Stickers (Four-Wheelers)**:
  * 🔵 **Blue Sticker**: Petrol & CNG vehicles.
  * 🟠 **Orange Sticker**: Diesel vehicles.
  * ⚪ **Grey Sticker**: Electric & other alternative fuels.
* 💵 **Non-HSRP Penalties**: Defective, faded, or non-HSRP plates incur **₹1,000 to ₹5,000** for first offense, and up to **₹10,000** for repeat violations.
* 📋 **How to Get HSRP in Tamil Nadu**:
  1. *Dealership / RTO*: Unlike some states, Tamil Nadu does not consistently route older vehicles through bookmyhsrp.com. Contact your authorized brand dealer in TN or your local RTO.
  2. *Documents*: Carry RC copy, active Vehicle Insurance, and Govt ID.
  3. *Official Fee*: Typically **₹400** for two-wheelers and **₹600–₹1,200** for cars (+₹100 for windshield sticker).
  4. *Fitment*: Manufactured within 5–7 working days; riveted with non-reusable snap locks at the dealer.`
  },
  {
    id: "tn_echallan_timeline",
    patterns: [/60 day/i, /echallan.*deadline/i, /pay.*challan/i, /court summon/i, /challan.*window/i, /challan.*due/i],
    response: `### ⚖️ Tamil Nadu Digital e-Challan Payment & 60-Day Rule

Under Tamil Nadu Traffic Police enforcement and the amended Motor Vehicles Act:

* ⏱️ **60-Day Payment Window**: All digital e-Challans issued via automated AI ANPR cameras or handheld police terminals must be settled **within 60 days** of issuance.
* ⚖️ **Consequences of Non-Payment**: Failing to pay within 60 days results in:
  1. Automated forwarding to Virtual Courts / Court Summons.
  2. Vehicle blacklist on Vahan/Sarathi portal (blocking insurance renewal, pollution tests, or RC transfer).
  3. Recommendation for **Driving Licence suspension**.
* 💳 **How to Pay**: Clear e-Challans online via the official Tamil Nadu Police portal (\`echallan.parivahan.gov.in\`) or at designated e-Seva centres.`
  },
  {
    id: "tn_ambulance_blocking",
    patterns: [/ambulance/i, /emergency vehicle/i, /block.*ambulance/i, /fire brigade/i],
    response: `### 🚨 Blocking Emergency Vehicles & Ambulances (Tamil Nadu)

Under **Section 194E of the Motor Vehicles Act**:

* 💵 **Strict Fine**: Flat **₹10,000** spot fine.
* ⚖️ **Imprisonment**: Up to **6 months jail time** for vehicle drivers who obstruct or fail to give way to an active ambulance or fire service vehicle.
* 📹 **AI Camera Enforcement**: Traffic junctions in Tamil Nadu are monitored by AI-enabled ANPR cameras that automatically flag and issue dockets for emergency vehicle obstruction.`
  },
  {
    id: "tn_juvenile_driving",
    patterns: [/underage/i, /minor.*driving/i, /juvenile/i, /school.*bike/i, /child.*drive/i],
    response: `### ⚠️ Underage / Juvenile Driving Penalties (Tamil Nadu)

Under **Section 199A of the Motor Vehicles Act**:

* 💵 **Statutory Fine**: **₹25,000** levied on the vehicle owner or parent/guardian.
* ⚖️ **Jail Term for Guardian**: Up to **3 years imprisonment** for the parent or legal vehicle owner.
* 🚗 **Vehicle Impoundment**: The vehicle's **Registration Certificate (RC) is cancelled for 1 full year**.
* 🛑 **Juvenile Restriction**: The minor is disqualified from obtaining a learner's or driving license until the age of **25 years**.`
  },
  {
    id: "digilocker_documents",
    patterns: [/digilocker/i, /mparivahan/i, /soft copy/i, /digital rc/i, /digital license/i, /carry physical/i, /show on phone/i],
    response: `### 📱 Digital Documents & DigiLocker Legality (India)

Under **Rule 139 of the Central Motor Vehicles Rules (CMVR)** and **MoRTH Circular (RT-11036/64/2017-MVL)** read with **Section 4 of the Information Technology Act, 2000**:

* ✅ **100% Legally Binding**: Electronic versions of your **Driving License (DL)**, **Registration Certificate (RC)**, and **Insurance** stored in the government **DigiLocker** or **mParivahan** apps carry equal legal standing to original physical cards.
* 🛡️ **Police Authority Limits**: Traffic police **cannot** demand physical cards if you present verified documents via DigiLocker or mParivahan. They are also **prohibited from seizing your physical mobile phone**.
* ⚠️ **Screenshots / Photos**: Simple phone camera gallery photos or WhatsApp PDFs are **not** accepted as official digital documents. They must be inside the verified DigiLocker or mParivahan application.`
  },
  {
    id: "police_key_snatching",
    patterns: [/snatch.*key/i, /take.*key/i, /remove.*key/i, /pull.*key/i, /police.*key/i, /constable.*fine/i, /police rights/i, /police stop/i],
    response: `### 👮 Traffic Police Stopping Protocol & Citizen Rights (India)

Under the **Motor Vehicles Act (Section 130)** and Police Standing Orders:

1. 🚫 **Key Snatching is Illegal**: No traffic officer or constable is legally permitted to forcibly turn off your vehicle ignition or snatch vehicle keys from moving or stopped vehicles.
2. 🎖️ **Officer Rank Requirement**: Only a police officer of the rank of **Assistant Sub-Inspector (ASI)**, Sub-Inspector (SI), or Inspector in official uniform with badge and e-challan terminal can issue a spot monetary fine. Constables can only stop traffic or record plate numbers.
3. 📄 **Receipt Requirement**: Never pay any cash fine without receiving an official printed **e-Challan receipt** or stamped government book receipt containing the officer's name, ID, and penal section.
4. 📹 **Right to Record**: Citizens have the legal right to film roadside traffic stops in public areas for safety, provided they do not obstruct law enforcement duties.`
  },
  {
    id: "dispute_challan",
    patterns: [/dispute.*challan/i, /wrong.*challan/i, /fake.*challan/i, /challenge.*challan/i, /not my car/i, /camera error/i, /false challan/i],
    response: `### ⚖️ How to Dispute or Cancel a False Traffic Challan (India)

If you received a wrong or faulty automated camera challan:

1. 🌐 **Parivahan Grievance Portal**:
   * Visit the official portal: \`echallan.parivahan.gov.in/gsticket/\`.
   * Submit your Challan Number, Vehicle Registration, and upload clear photo/dashcam evidence proving camera misidentification or clone plate fraud.
2. 📧 **Traffic Police Notice Branch**:
   * Email the State Traffic Police Notice Branch (e.g., Delhi Traffic Police Notice Branch at \`info@delhitrafficpolice.nic.in\`). Attach the challan PDF and your RC copy showing distinct vehicle features.
3. 🏛️ **Virtual Court Redressal**:
   * Access \`vcourts.gov.in\`. Search by mobile number or vehicle number.
   * Instead of accepting the penalty, select **"I want to contest / plead Not Guilty"**. The matter will be assigned to a designated traffic magistrate or National Lok Adalat where fines are frequently overturned.`
  },
  {
    id: "pay_challan_online",
    patterns: [/pay.*challan/i, /how.*pay.*fine/i, /online.*payment.*challan/i, /parivahan.*pay/i, /vcourt/i],
    response: `### 💳 Step-by-Step: How to Pay Traffic Challan Online

1. **Parivahan e-Challan Portal**:
   * Open: \`https://echallan.parivahan.gov.in\`
   * Click **"Check Online Services"** ➔ **"Check Challan Status"**.
   * Enter your **Challan Number**, **Vehicle Number** (with last 5 digits of Chassis/Engine number), or **DL Number**.
   * Verify the violation docket and click **"Pay Now"** (Net Banking, UPI, Credit/Debit card).
2. **Virtual Court (For Sent to Court Challans)**:
   * Open: \`https://vcourts.gov.in\`
   * Select your State & Court Department ➔ Enter Mobile/Challan No.
   * View the compounding penalty ordered by the magistrate and pay securely via Bharatkosh / State PG.`
  },
  {
    id: "underage_driving",
    patterns: [/minor.*driv/i, /underage/i, /child.*driv/i, /kid.*driv/i, /below 18.*driv/i, /17 year.*driv/i, /16 year.*driv/i],
    response: `### ⚠️ Underage / Minor Driving Strict Penalties

Under **Section 199A of the Motor Vehicles (Amendment) Act**:

* 🔒 **Parent / Vehicle Owner Liability**: The parent or guardian of the juvenile, or the vehicle owner who permitted them to drive, is deemed guilty of a criminal offense:
  * **Imprisonment**: Up to **3 years** in jail.
  * **Compounding Fine**: **₹25,000**.
* 🚗 **Vehicle Deregistration**: Vehicle registration certificate (RC) is **suspended for 1 full year**.
* 🚫 **License Disqualification for Minor**: The juvenile is legally **barred from obtaining a driving license until reaching age 25**.
* ⚖️ **Juvenile Justice Act**: The minor will also face summary proceedings under the Juvenile Justice (Care and Protection of Children) Act.`
  },
  {
    id: "triple_riding",
    patterns: [/triple.*rid/i, /3 people.*bike/i, /three.*riding/i, /tripling/i, /3 on bike/i],
    response: `### 🏍️ Triple Riding on Two-Wheelers (India)

Under **Section 194C of the Motor Vehicles Act**:

* 💵 **Statutory Fine**: **₹1,000**.
* ⚠️ **License Suspension**: Disqualification of driving license for **3 months**.
* 🛑 **Safety Hazard**: Two-wheelers are engineered specifically for a single pillion passenger. Carrying two or more pillion passengers severely compromises center of gravity, increases braking distance, and destabilizes steering.`
  },
  {
    id: "tinted_glass",
    patterns: [/tint/i, /sun film/i, /black glass/i, /dark window/i, /vlt/i, /film.*glass/i],
    response: `### 🚗 Window Tint & Sun Film Regulations (India)

Under the **Supreme Court ruling (Avishek Goenka v. Union of India)** and **Rule 100 CMVR**:

* ❌ **Zero Aftermarket Film Allowed**: The installation of any aftermarket sun film, dark tinting sticker, or curtain on car windows is **strictly illegal**, regardless of its transparency percentage.
* 📐 **Factory Glass Standards**: Vehicles must maintain visual light transmission (VLT) baked into the glass at manufacture:
  * **Front & Rear Windscreens**: Minimum **70% VLT**.
  * **Side Door Glasses**: Minimum **50% VLT**.
* 💵 **Penalty**: Spot fine of **₹500 to ₹1,500** under Section 177/177A MVA + compulsory removal of the film on the spot by traffic enforcement.`
  },
  {
    id: "pressure_horns",
    patterns: [/horn/i, /pressure horn/i, /loud exhaust/i, /silencer/i, /modified exhaust/i, /noise/i],
    response: `### 📢 Pressure Horns & Modified Silencers (Exhausts)

Under **Section 190(2) of the Motor Vehicles Act** and **Rule 119 CMVR**:

* 💵 **Fine Penalty**: Up to **₹10,000** for noise pollution / non-standard safety equipment.
* 🛑 **Seizure / Impoundment**: The vehicle can be impounded or directed to an authorized inspection station until stock OEM exhaust and standard horns (under 80 decibels) are reinstalled.
* 🚫 **Multi-toned & siren horns**: Prohibited for civilian vehicles; reserved strictly for ambulances, police, and fire tenders.`
  },
  {
    id: "hit_and_run",
    patterns: [/hit and run/i, /hit & run/i, /flee.*accident/i, /run away.*accident/i],
    response: `### 🚨 Hit and Run Statutory Mandates & Driver Obligations

Under the **Bharatiya Nyaya Sanhita (BNS Section 106)** and **Motor Vehicles Act (Section 134)**:

1. **Mandatory Duty to Report**: If involved in a collision resulting in injury or property damage, the driver must immediately arrange medical attention for the victim and report the occurrence to the nearest police station or dial \`112\`.
2. **Escalated Penalties**: Leaving the scene of an accident without reporting to an officer or magistrate carries penalties up to **10 years imprisonment** and a substantial monetary fine under BNS provisions.
3. 🛡️ **Good Samaritan Shield**: Under **Section 134A MVA**, any bystander or passerby who assists accident victims cannot be harassed, detained, or forced to pay hospital admission charges.`
  },
  {
    id: "puc_certificate",
    patterns: [/puc/i, /pollution.*cert/i, /emission.*cert/i, /smoke.*test/i],
    response: `### 💨 Pollution Under Control (PUC) Statutory Requirements

Under **Section 190(2) of the Motor Vehicles Act**:

* 💵 **Strict Fine**: **₹10,000** flat fine across metropolitan zones (Delhi, Mumbai, Bengaluru, Chennai) and potential **license suspension for 3 months**.
* 📅 **Validity Guidelines**:
  * **New Vehicles**: Covered by manufacturer's initial fitness for **1 year** from registration date.
  * **BS4 / BS6 Vehicles**: Renewable every **12 months** (1 year).
  * **Pre-BS4 / Older Vehicles**: Renewable every **6 months**.`
  }
];

export function analyzeQuery(rawText, defaultLocation = { country: "IN", state: "TN" }) {
  if (!rawText || rawText.trim() === '') {
    return {
      intent: 'greetings',
      responseText: "Hello! I am **DriveLegal AI**, your offline-resilient road safety and traffic law copilot. How can I help you with Indian traffic statutes, compounding challans, or emergency protocols today?"
    };
  }

  const tokens = tokenize(rawText);
  const detectedLoc = extractLocation(tokens, rawText);
  const detectedVehicle = extractVehicle(tokens, rawText);
  const targetCountry = "IN";
  const targetState = detectedLoc ? detectedLoc.state : (defaultLocation.state || "TN");
  const countryData = lawDatabase.countries.IN;

  // 1. Check specialized legal knowledge patterns
  for (const item of LEGAL_INTENT_PATTERNS) {
    for (const pat of item.patterns) {
      if (pat.test(rawText)) {
        return {
          intent: item.id,
          detectedLoc,
          detectedVehicle,
          responseText: item.response
        };
      }
    }
  }

  // 2. Greetings intent
  if (/\b(hi|hello|hey|greetings|good morning|hola|howdy|whats up)\b/i.test(rawText)) {
    const stateName = countryData.states[targetState]?.name || "Tamil Nadu";
    return {
      intent: 'greetings',
      detectedLoc,
      detectedVehicle,
      responseText: `Hello! I'm **DriveLegal AI**, your verified road compliance copilot. I am tuned to **India (Motor Vehicles Act)** for **${stateName}**.\n\nHere are legal queries I can answer for you:\n* ⚖️ **Calculate fines** (e.g., *"What is the fine for speeding or red light violation?"*)\n* 📱 **Citizen Rights** (e.g., *"Is DigiLocker valid for police check?"*)\n* 👮 **Police Stops** (e.g., *"Can police snatch my bike keys or seize my phone?"*)\n* 💳 **Challan Procedures** (e.g., *"How do I dispute a wrong challan online?"*)\n* 🚨 **Emergency Hotlines** (e.g., *"Give me police and ambulance numbers"*)\n\nWhat traffic guideline or situation can I help you with?`
    };
  }

  // 3. Emergency intent
  if (/\b(emergency|accident|help|tow|ambulance|police|crash|hospital|breakdown|flat tire|hotline)\b/i.test(rawText)) {
    const emergencyInfo = countryData.states[targetState]?.emergency || countryData.defaultEmergency;
    const stateName = countryData.states[targetState]?.name || "Tamil Nadu";
    return {
      intent: 'emergency',
      detectedLoc,
      responseText: `🚨 **EMERGENCY ROADSIDE SERVICES PROTOCOL - ${stateName.toUpperCase()}, INDIA** 🚨\n\nIf you are involved in a traffic accident or highway breakdown, pull over immediately, turn on hazard warning lights, and call:\n* 📞 **National Emergency Number**: \`112\` (Direct Police & First Responders)\n* 🚑 **Medical / Ambulance**: \`${emergencyInfo.ambulance || '102'}\`\n* 🚒 **Fire Brigade**: \`${emergencyInfo.fire || '101'}\`\n* 🚧 **National Highway Patrol**: \`${emergencyInfo.highwayPatrol || '1033'}\`\n\n*Safety Advisory: Under Section 134A MVA (Good Samaritan Law), anyone who provides first aid or rushes an accident victim to a hospital is protected from police questioning or harassment.*`
    };
  }

  // 4. Exact statutory rule matching from lawDatabase
  let bestMatchRule = null;
  let highestScore = 0;

  for (const [catKey, category] of Object.entries(countryData.categories)) {
    for (const rule of category.rules) {
      let score = 0;
      const titleTokens = tokenize(rule.title);
      for (const t of tokens) {
        if (titleTokens.includes(t)) score += 3;
      }
      const descTokens = tokenize(rule.description);
      for (const t of tokens) {
        if (descTokens.includes(t)) score += 1.5;
      }
      if (detectedVehicle) {
        if (rule.vehicleTypes.includes(detectedVehicle) || rule.vehicleTypes.includes('all')) {
          score += 2;
        } else {
          score -= 2;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatchRule = rule;
      }
    }
  }

  if (bestMatchRule && highestScore >= 3) {
    const symbol = "₹";
    let baseFine = bestMatchRule.baseFine;
    let desc = bestMatchRule.description;
    let overrideText = '';

    if (targetState && bestMatchRule.stateOverrides && bestMatchRule.stateOverrides[targetState]) {
      const override = bestMatchRule.stateOverrides[targetState];
      baseFine = override.baseFine !== undefined ? override.baseFine : baseFine;
      desc = override.description !== undefined ? override.description : desc;
      overrideText = `*(State amendment applied for **${countryData.states[targetState]?.name || targetState}**)*`;
    }

    const stateName = countryData.states[targetState]?.name || "Tamil Nadu";
    const vehicleScope = bestMatchRule.vehicleTypes.includes('all')
      ? "All Vehicle Classes"
      : bestMatchRule.vehicleTypes.map(v => v.toUpperCase()).join(", ");

    return {
      intent: 'rule_match',
      detectedLoc,
      detectedVehicle,
      ruleMatched: bestMatchRule,
      responseText: `### 🛡️ Statutory Violation Analysis: ${bestMatchRule.title}

Here is the statutory legal standing under the **Motor Vehicles Act** in **${stateName}, India** for **${vehicleScope}**:

* ⚖️ **Legal Section:** \`${bestMatchRule.section}\`
* 💵 **Compounding Fine:** **${symbol}${baseFine.toLocaleString()}** ${overrideText}
* ⚠️ **Demerit Record:** **${bestMatchRule.points} Points** (Direct citation docket)
* 🚗 **Target Vehicles:** ${vehicleScope}

**Statutory Provision & Enforcement Details:**
${desc}

**Driver Guidance:**
Always carry verified credentials via DigiLocker or mParivahan. Ensure vehicle equipment meets Central Motor Vehicles Rules (CMVR) compliance to prevent spot compound notices or license disqualification.`
    };
  }

  // 5. Intelligent Fallback for general queries
  const stateName = countryData.states[targetState]?.name || "Tamil Nadu";
  return {
    intent: 'general_guidance',
    detectedLoc,
    detectedVehicle,
    responseText: `### 📋 Traffic Compliance Guidance (${stateName}, India)

I analyzed your query regarding **${rawText}**. Here are the applicable statutory road regulations under the **Motor Vehicles Act (MVA)**:

1. **Speed & Lane Discipline**: Section 183 MVA enforces speed limits. Fines range from **₹1,000** for Light Motor Vehicles (cars) up to **₹2,000–₹4,000** for commercial transport.
2. **Safety Gear**: Wearing a BIS-certified helmet with chin strap securely fastened is mandatory for both rider and pillion (**₹1,000 fine + 3-month license disqualification** under Section 194D). Front and rear seatbelts are mandatory for four-wheelers (**₹1,000** under Section 194B).
3. **Valid Documentation**: Ensure your **Driving License**, **RC**, **Insurance**, and **PUC** are up-to-date. Digital copies in government **DigiLocker** or **mParivahan** are 100% legally recognized by traffic enforcement.
4. **Zero Tolerance Violations**: Drunk driving (BAC > 30mg/100ml) incurs a **₹10,000 fine and up to 6 months jail** (Section 185). Red light jumping and rash driving incur **₹5,000** (Section 184).

*Would you like to calculate an exact fine in the **Challan Calculator** or lookup specific legal sections in the **Law Explorer**?*`
  };
}

export function applyQuantumStateCollapse(synthesizedText, verifiedFacts) {
  if (!synthesizedText) return "";
  if (!verifiedFacts || verifiedFacts.length === 0) return synthesizedText;
  const numberRegex = /(\d+(?:,\d+)*(?:\.\d+)?)/g;
  const generatedNumbers = synthesizedText.match(numberRegex) || [];
  const observableFactsText = Array.isArray(verifiedFacts) ? verifiedFacts.join(" ") : verifiedFacts;
  const verifiedNumbers = observableFactsText.match(numberRegex) || [];
  const verifiedNumbersSet = new Set(verifiedNumbers);
  let collapsedText = synthesizedText;
  for (const num of generatedNumbers) {
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
        const escapedNum = num.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const numRegex = new RegExp(`\\b${escapedNum}\\b`, 'g');
        collapsedText = collapsedText.replace(numRegex, `${nearestVal} [Collapsed Fact: Corrected from ${num}]`);
      }
    }
  }
  return collapsedText;
}
