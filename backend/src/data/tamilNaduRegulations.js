/**
 * Tamil Nadu Statutory Traffic & HSRP Regulations Dataset
 * Compiled from official enforcement dockets and state transport guidelines.
 */

export const tamilNaduRegulations = {
  jurisdiction: "Tamil Nadu",
  stateCode: "TN",
  governingAct: "Amended Motor Vehicles Act (MoRTH)",
  overview: {
    title: "Tamil Nadu Traffic Compliance & e-Challan Enforcement",
    description: "Tamil Nadu traffic rules follow the amended Motor Vehicles Act, requiring valid documents, safety gear, and standard High-Security Registration Plates (HSRP) on all vehicles. Breaking these rules leads to heavy digital e-Challans that must be paid within 60 days to avoid court summons or license suspension.",
    paymentWindowDays: 60,
    enforcementMechanism: "Automated AI ANPR Camera Grid, Traffic Police e-Challan Handheld Terminals, and Parivahan Digital Gateway",
    sources: ["Cars24", "ICICI Lombard", "Tata AIG"]
  },
  keyRules: [
    {
      id: "tn_rule_documents",
      title: "Carry Valid Documents",
      shortSummary: "DL, RC, Insurance & PUC mandatory in physical or DigiLocker format.",
      description: "Drivers must always carry their Driving Licence (DL), Registration Certificate (RC), Motor Insurance, and Pollution Under Control (PUC) certificate in physical or DigiLocker/mParivahan format.",
      icon: "FileCheck",
      legalBasis: "Rule 139 CMVR / IT Act 2000"
    },
    {
      id: "tn_rule_helmets",
      title: "Wear ISI-Certified Helmets",
      shortSummary: "Rider and pillion must wear strapped ISI helmets.",
      description: "Both the rider and the pillion passenger on a two-wheeler must wear properly strapped, ISI-marked helmets at all times.",
      icon: "ShieldAlert",
      legalBasis: "Section 194D MVA (3-month license suspension on violation)"
    },
    {
      id: "tn_rule_seatbelts",
      title: "Fasten Seatbelts",
      shortSummary: "Mandatory for driver and front passenger in 4-wheelers.",
      description: "Both the driver and front passenger in four-wheelers must wear seatbelts at all times while the vehicle is in motion.",
      icon: "Shield",
      legalBasis: "Section 194B(1) MVA"
    },
    {
      id: "tn_rule_mobile",
      title: "No Mobile Phone Usage",
      shortSummary: "Strictly banned unless using hands-free strictly for navigation.",
      description: "Holding or using a mobile phone while driving or riding is strictly banned unless using a hands-free device strictly for navigation purposes.",
      icon: "Smartphone",
      legalBasis: "Section 184(c) MVA (Dangerous Driving)"
    },
    {
      id: "tn_rule_signals_ambulance",
      title: "Follow Road Markings & Give Way to Ambulances",
      shortSummary: "Stop before white line; zero tolerance for blocking ambulances.",
      description: "Stopping before the white stop line at red lights, staying out of 'No Entry' zones, and giving clear way to ambulances and first responders are strictly enforced via AI surveillance cameras.",
      icon: "TrafficCone",
      legalBasis: "Section 194E MVA (₹10,000 fine for blocking emergency vehicles)"
    }
  ],
  hsrpRegulations: {
    title: "Number Plate (HSRP) Standards in Tamil Nadu",
    authority: "Ministry of Road Transport and Highways (MoRTH)",
    standards: [
      {
        feature: "Mandatory HSRP Fitment",
        details: "Every vehicle must display a tamper-proof High-Security Registration Plate (HSRP) fitted with non-removable snap locks, a laser-etched 10-digit PIN, and a Chromium Ashoka Chakra hologram."
      },
      {
        feature: "Color-Coded Plates by Vehicle Type",
        details: "Private petrol/diesel vehicles must use white plates with black lettering; commercial vehicles must use yellow plates with black lettering; electric vehicles (EVs) must use green plates with white/yellow lettering."
      },
      {
        feature: "Fuel-Type Windshield Stickers",
        details: "Four-wheelers must display a color-coded third registration sticker on the windshield: Blue for petrol/CNG, Orange for diesel, and Grey for other fuel categories."
      },
      {
        feature: "No Fancy Fonts or Stickers",
        details: "Decorative lettering, regional scripts, political party symbols, or damaged/faded plates are illegal and trigger automatic camera fines ranging from ₹1,000 to ₹10,000."
      }
    ],
    plateColorGuide: [
      { type: "Private Petrol / Diesel / Hybrid", plateBg: "#FFFFFF", textColor: "#000000", border: "#CBD5E1", label: "White Plate with Black Text" },
      { type: "Commercial Passenger & Cargo", plateBg: "#FACC15", textColor: "#000000", border: "#EAB308", label: "Yellow Plate with Black Text" },
      { type: "Electric Vehicles (EVs)", plateBg: "#15803D", textColor: "#FFFFFF", border: "#166534", label: "Green Plate with White Text" }
    ],
    stickerColorGuide: [
      { fuel: "Petrol & CNG", colorHex: "#3B82F6", label: "Blue Windshield Sticker" },
      { fuel: "Diesel", colorHex: "#F97316", label: "Orange Windshield Sticker" },
      { fuel: "Electric & Other Alternative Fuels", colorHex: "#6B7280", label: "Grey Windshield Sticker" }
    ]
  },
  hsrpProcurementGuide: {
    title: "How to Get an HSRP Number Plate in Tamil Nadu",
    applicability: "Vehicles bought after April 1, 2019, already come fitted with HSRP plates from the dealer. For older vehicles registered in Tamil Nadu, follow these steps:",
    steps: [
      {
        stepNumber: 1,
        title: "Check Dealer and RTO Availability",
        instruction: "Unlike several other states, Tamil Nadu does not consistently route old-vehicle bookings through the central bookmyhsrp.com portal. Contact your vehicle brand's authorized dealership in Tamil Nadu or visit your regional RTO to place an HSRP order."
      },
      {
        stepNumber: 2,
        title: "Prepare Required Documents",
        instruction: "Carry a copy of your Registration Certificate (RC), valid Vehicle Insurance policy, Govt ID proof (Aadhaar / Voter ID), and active Address proof."
      },
      {
        stepNumber: 3,
        title: "Pay the Official Standard Fee",
        instruction: "Pay the official plate fee at the authorized dealership or RTO counter: typically ₹400 for two-wheelers and ₹600–₹1,200 for cars, plus ₹100 for the fuel-type third registration windshield sticker."
      },
      {
        stepNumber: 4,
        title: "Complete Authorized Snap-Lock Fitment",
        instruction: "Once the plate is manufactured (usually within 5–7 working days), return to the authorized vendor or dealership on your appointment date to have the snap-lock plate riveted onto your vehicle."
      }
    ]
  },
  finesTable: [
    {
      id: "tn_fine_helmet",
      violation: "Riding without helmet (Rider or Pillion)",
      firstOffence: "₹1,000",
      firstOffenceNum: 1000,
      repeatOffence: "3-month Driving Licence suspension",
      section: "Section 194D MVA",
      severity: "high"
    },
    {
      id: "tn_fine_seatbelt",
      violation: "Driving without seatbelt",
      firstOffence: "₹1,000",
      firstOffenceNum: 1000,
      repeatOffence: "₹1,000 and/or community service",
      section: "Section 194B(1) MVA",
      severity: "medium"
    },
    {
      id: "tn_fine_triple_riding",
      violation: "Triple riding on a two-wheeler",
      firstOffence: "₹1,000 – ₹2,000",
      firstOffenceNum: 1000,
      repeatOffence: "3-month Driving Licence suspension",
      section: "Section 194C MVA",
      severity: "high"
    },
    {
      id: "tn_fine_mobile_use",
      violation: "Using mobile phone while driving",
      firstOffence: "₹1,000",
      firstOffenceNum: 1000,
      repeatOffence: "Up to ₹10,000",
      section: "Section 184(c) MVA",
      severity: "high"
    },
    {
      id: "tn_fine_overspeeding_lmv",
      violation: "Overspeeding (Light Motor Vehicle)",
      firstOffence: "₹1,000",
      firstOffenceNum: 1000,
      repeatOffence: "₹2,000 – ₹5,000",
      section: "Section 183(1) MVA",
      severity: "medium"
    },
    {
      id: "tn_fine_red_light",
      violation: "Jumping a red light / Dangerous driving",
      firstOffence: "₹1,000 – ₹5,000",
      firstOffenceNum: 1000,
      repeatOffence: "Licence suspension",
      section: "Section 184 MVA",
      severity: "high"
    },
    {
      id: "tn_fine_hsrp",
      violation: "Defective or Non-HSRP number plate",
      firstOffence: "₹1,000 – ₹5,000",
      firstOffenceNum: 1000,
      repeatOffence: "Up to ₹10,000 for repeat offences",
      section: "Section 177 & MoRTH HSRP Rules",
      severity: "high"
    },
    {
      id: "tn_fine_insurance",
      violation: "Driving without valid Insurance",
      firstOffence: "₹2,000",
      firstOffenceNum: 2000,
      repeatOffence: "₹4,000 and/or up to 3 months jail",
      section: "Section 196 MVA",
      severity: "high"
    },
    {
      id: "tn_fine_police_orders",
      violation: "Disobeying traffic police orders",
      firstOffence: "₹2,000",
      firstOffenceNum: 2000,
      repeatOffence: "₹2,000",
      section: "Section 179 MVA",
      severity: "medium"
    },
    {
      id: "tn_fine_no_dl",
      violation: "Driving without valid Driving Licence",
      firstOffence: "₹5,000",
      firstOffenceNum: 5000,
      repeatOffence: "₹10,000",
      section: "Section 181 MVA",
      severity: "critical"
    },
    {
      id: "tn_fine_no_rc",
      violation: "Driving without valid Registration (RC)",
      firstOffence: "₹5,000",
      firstOffenceNum: 5000,
      repeatOffence: "₹10,000",
      section: "Section 192 MVA",
      severity: "critical"
    },
    {
      id: "tn_fine_no_puc",
      violation: "Driving without valid PUC certificate",
      firstOffence: "₹10,000",
      firstOffenceNum: 10000,
      repeatOffence: "Up to 6 months jail or community service",
      section: "Section 190(2) MVA",
      severity: "critical"
    },
    {
      id: "tn_fine_blocking_ambulance",
      violation: "Blocking emergency vehicles (Ambulance)",
      firstOffence: "₹10,000",
      firstOffenceNum: 10000,
      repeatOffence: "Up to 6 months imprisonment",
      section: "Section 194E MVA",
      severity: "critical"
    },
    {
      id: "tn_fine_drunk_driving",
      violation: "Drunk driving",
      firstOffence: "₹10,000",
      firstOffenceNum: 10000,
      repeatOffence: "₹15,000 and/or up to 2 years jail",
      section: "Section 185 MVA",
      severity: "critical"
    },
    {
      id: "tn_fine_juvenile_driving",
      violation: "Underage / Juvenile driving",
      firstOffence: "₹25,000",
      firstOffenceNum: 25000,
      repeatOffence: "3 years jail for guardian + RC cancelled for 1 year",
      section: "Section 199A MVA",
      severity: "critical"
    }
  ]
};

