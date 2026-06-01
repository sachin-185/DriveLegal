export const lawDatabase = {
  countries: {
    IN: {
      name: "India",
      currency: "INR",
      symbol: "₹",
      defaultEmergency: {
        police: "112",
        ambulance: "102",
        highwayPatrol: "1033",
        fire: "101"
      },
      states: {
        DL: { name: "Delhi", factor: 1.0 },
        MH: { name: "Maharashtra", factor: 1.0 },
        TN: { name: "Tamil Nadu", factor: 1.0 },
        KA: { name: "Karnataka", factor: 1.0 },
        UP: { name: "Uttar Pradesh", factor: 0.9 }
      },
      categories: {
        speeding: {
          name: "Speeding / Rash Driving",
          icon: "Gauge",
          rules: [
            {
              id: "in_speed_lmv",
              title: "Over-speeding (Light Motor Vehicle)",
              section: "Section 183(1)(i) MVA",
              baseFine: 1000,
              points: 0,
              description: "Driving a light motor vehicle (like a car) exceeding the specified speed limits.",
              vehicleTypes: ["car", "suv"],
              stateOverrides: {
                KA: { baseFine: 2000, description: "Karnataka enforces strict 2000 INR fine for LMV over-speeding." },
                MH: { baseFine: 1500 }
              }
            },
            {
              id: "in_speed_two_wheeler",
              title: "Over-speeding (Two-Wheeler)",
              section: "Section 183(1)(i) MVA",
              baseFine: 1000,
              points: 0,
              description: "Riding a two-wheeler exceeding local speed limits.",
              vehicleTypes: ["motorcycle", "scooter"],
              stateOverrides: {
                TN: { baseFine: 1000 }
              }
            },
            {
              id: "in_speed_hmv",
              title: "Over-speeding (Medium/Heavy Commercial)",
              section: "Section 183(1)(ii) MVA",
              baseFine: 2000,
              points: 0,
              description: "Driving commercial, heavy cargo or passenger vehicles above speed limits.",
              vehicleTypes: ["commercial", "bus", "truck"],
              stateOverrides: {
                DL: { baseFine: 4000, description: "Delhi enforces a strict 4000 INR fine for commercial speeding in city limits." }
              }
            },
            {
              id: "in_dangerous_driving",
              title: "Dangerous / Rash Driving",
              section: "Section 184 MVA",
              baseFine: 5000,
              points: 0,
              description: "Driving in a manner dangerous to the public, jumping red lights or weaving in traffic. Second offense invites up to 10,000 INR fine.",
              vehicleTypes: ["all"],
              stateOverrides: {}
            }
          ]
        },
        sobriety: {
          name: "Drunk Driving & Sobriety",
          icon: "ShieldAlert",
          rules: [
            {
              id: "in_dui",
              title: "Drunk Driving (DUI)",
              section: "Section 185 MVA",
              baseFine: 10000,
              points: 0,
              description: "Driving with BAC (Blood Alcohol Content) exceeding 30 mg per 100 ml of blood detected by breath analyzer. Subject to jail terms up to 6 months for first offense.",
              vehicleTypes: ["all"],
              stateOverrides: {}
            }
          ]
        },
        safety_gear: {
          name: "Safety Gear (Helmets & Seatbelts)",
          icon: "Shield",
          rules: [
            {
              id: "in_no_helmet",
              title: "Riding Without Helmet",
              section: "Section 194D MVA",
              baseFine: 1000,
              points: 0,
              description: "Riding a two-wheeler without a protective helmet or with helmet unstrapped. Disqualification of license for 3 months.",
              vehicleTypes: ["motorcycle", "scooter"],
              stateOverrides: {
                UP: { baseFine: 1000, description: "1000 INR fine + mandatory road safety counseling in Uttar Pradesh." }
              }
            },
            {
              id: "in_no_seatbelt",
              title: "Driving Without Seatbelt",
              section: "Section 194B(1) MVA",
              baseFine: 1000,
              points: 0,
              description: "Driving a four-wheeler without wearing a seatbelt, or carrying passengers in the front/rear without seatbelts fastened.",
              vehicleTypes: ["car", "suv", "commercial"],
              stateOverrides: {}
            }
          ]
        },
        licensing: {
          name: "Licensing & Documents",
          icon: "FileText",
          rules: [
            {
              id: "in_no_license",
              title: "Driving Without Valid License",
              section: "Section 181 MVA",
              baseFine: 5000,
              points: 0,
              description: "Driving a vehicle without holding a valid driving license for that specific class of vehicle.",
              vehicleTypes: ["all"],
              stateOverrides: {}
            },
            {
              id: "in_no_insurance",
              title: "Driving Without Third-Party Insurance",
              section: "Section 196 MVA",
              baseFine: 2000,
              points: 0,
              description: "Operating a vehicle without active third-party liability insurance. Second offense incurs 4000 INR fine or 3 months imprisonment.",
              vehicleTypes: ["all"],
              stateOverrides: {}
            },
            {
              id: "in_expired_puc",
              title: "No Valid Pollution Certificate (PUC)",
              section: "Section 190(2) MVA",
              baseFine: 10000,
              points: 0,
              description: "Operating a vehicle without a valid Pollution Under Control (PUC) certificate. Extremely strict in metropolitan zones.",
              vehicleTypes: ["all"],
              stateOverrides: {
                DL: { baseFine: 10000, description: "Strictly enforced in Delhi NCR with immediate court challan of 10000 INR and potential license suspension." }
              }
            }
          ]
        },
        signals: {
          name: "Signals & Right of Way",
          icon: "TrafficCone",
          rules: [
            {
              id: "in_red_light",
              title: "Jumping Red Light",
              section: "Section 184(c) MVA",
              baseFine: 5000,
              points: 0,
              description: "Disobeying red traffic signals. Usually categorized under dangerous driving.",
              vehicleTypes: ["all"],
              stateOverrides: {
                MH: { baseFine: 5000 },
                TN: { baseFine: 1000, description: "Often charged at 1000 INR for first-time offense under generic traffic violation if no hazard is caused." }
              }
            },
            {
              id: "in_wrong_way",
              title: "Driving in Wrong Direction / One-Way",
              section: "Section 184 MVA",
              baseFine: 5000,
              points: 0,
              description: "Driving against the designated flow of traffic, heavily penalized due to high head-on collision risks.",
              vehicleTypes: ["all"],
              stateOverrides: {}
            }
          ]
        }
      }
    },
    US: {
      name: "United States",
      currency: "USD",
      symbol: "$",
      defaultEmergency: {
        police: "911",
        ambulance: "911",
        highwayPatrol: "911 (or local State Patrol)",
        fire: "911"
      },
      states: {
        CA: { name: "California", factor: 1.2 },
        NY: { name: "New York", factor: 1.15 },
        TX: { name: "Texas", factor: 1.0 },
        FL: { name: "Florida", factor: 1.05 }
      },
      categories: {
        speeding: {
          name: "Speeding / Reckless",
          icon: "Gauge",
          rules: [
            {
              id: "us_speed_1_15",
              title: "Speeding (1-15 mph over limit)",
              section: "CVC 22350 / NY VTL 1180",
              baseFine: 150,
              points: 1,
              description: "Driving above the posted speed limit by 1 to 15 miles per hour.",
              vehicleTypes: ["all"],
              stateOverrides: {
                CA: { baseFine: 238, points: 1, description: "California base fine + heavy county assessments totals around $238." },
                NY: { baseFine: 150, points: 3, description: "New York penalizes minor speeding with 3 points on license." }
              }
            },
            {
              id: "us_speed_16_25",
              title: "Speeding (16-25 mph over limit)",
              section: "CVC 22349(b) / NY VTL 1180",
              baseFine: 250,
              points: 1,
              description: "Driving above the posted speed limit by 16 to 25 miles per hour.",
              vehicleTypes: ["all"],
              stateOverrides: {
                CA: { baseFine: 360, points: 1 },
                NY: { baseFine: 300, points: 4 }
              }
            },
            {
              id: "us_reckless",
              title: "Reckless Driving",
              section: "CVC 23103 / NY VTL 1212",
              baseFine: 500,
              points: 2,
              description: "Driving with willful or wanton disregard for the safety of persons or property. Criminal misdemeanor.",
              vehicleTypes: ["all"],
              stateOverrides: {
                CA: { baseFine: 1000, points: 2, description: "In California, reckless driving can carry up to $1000 in fines and vehicle impoundment." }
              }
            }
          ]
        },
        sobriety: {
          name: "DUI & Sobriety",
          icon: "ShieldAlert",
          rules: [
            {
              id: "us_dui",
              title: "Driving Under the Influence (DUI)",
              section: "CVC 23152 / NY VTL 1192",
              baseFine: 1000,
              points: 2,
              description: "Operating a motor vehicle with a Blood Alcohol Concentration (BAC) of 0.08% or higher. Misdemeanor, includes license suspension and mandatory DUI school.",
              vehicleTypes: ["all"],
              stateOverrides: {
                CA: { baseFine: 1000, points: 2, description: "First offense in CA carries fines up to $1000 + penalty assessments making total cost closer to $2000, plus mandatory ignition interlock device (IID)." },
                NY: { baseFine: 500, points: 99, description: "NY has strict automatic 6-month license revocation (99 demerits equivalent) and up to $1000 fine." }
              }
            }
          ]
        },
        safety_gear: {
          name: "Seatbelt & Safety Seats",
          icon: "Shield",
          rules: [
            {
              id: "us_no_seatbelt",
              title: "No Seatbelt (Adult)",
              section: "CVC 27315 / NY VTL 1229-c",
              baseFine: 50,
              points: 0,
              description: "Failure of a driver or passenger over 16 to wear a properly fitted safety belt.",
              vehicleTypes: ["car", "suv", "commercial"],
              stateOverrides: {
                CA: { baseFine: 162, points: 0, description: "California safety belt fine is around $162 after court fees." },
                NY: { baseFine: 50, points: 0, description: "New York imposes a $50 fine, but adds 3 points if the unbelted passenger is under 16." }
              }
            },
            {
              id: "us_distracted",
              title: "Distracted Driving (Cell Phone Use)",
              section: "CVC 23123.5 / NY VTL 1225-d",
              baseFine: 100,
              points: 1,
              description: "Operating a motor vehicle while holding or using an electronic wireless communications device (like a smartphone) unless hands-free.",
              vehicleTypes: ["all"],
              stateOverrides: {
                NY: { baseFine: 150, points: 5, description: "New York is extremely strict, charging $150 for first offense plus 5 demerit points!" },
                CA: { baseFine: 162, points: 1 }
              }
            }
          ]
        },
        licensing: {
          name: "Licensing & Insurance",
          icon: "FileText",
          rules: [
            {
              id: "us_unlicensed",
              title: "Driving Unlicensed",
              section: "CVC 12500 / NY VTL 509",
              baseFine: 250,
              points: 0,
              description: "Driving a vehicle without a valid state license or incorrect class.",
              vehicleTypes: ["all"],
              stateOverrides: {
                CA: { baseFine: 300, description: "Can be charged as an infraction or misdemeanor in CA." }
              }
            },
            {
              id: "us_no_insurance",
              title: "Driving Without Proof of Financial Responsibility",
              section: "CVC 16028 / NY VTL 319",
              baseFine: 500,
              points: 0,
              description: "Failure to provide active proof of vehicle liability insurance when requested by an officer.",
              vehicleTypes: ["all"],
              stateOverrides: {
                CA: { baseFine: 490, description: "First offense base fine $100-$200, but assessments raise total cost to ~$490." },
                NY: { baseFine: 150, description: "NY fine ranges from $150 to $1500 or 15 days in jail + automatic civil penalty of $750." }
              }
            }
          ]
        }
      }
    },
    UK: {
      name: "United Kingdom",
      currency: "GBP",
      symbol: "£",
      defaultEmergency: {
        police: "999",
        ambulance: "999",
        highwayPatrol: "999 (National Highways)",
        fire: "999"
      },
      states: {
        ENG: { name: "England & Wales", factor: 1.0 },
        SCT: { name: "Scotland", factor: 1.0 },
        LDN: { name: "London (Metropolitan)", factor: 1.2 }
      },
      categories: {
        speeding: {
          name: "Speeding Infractions",
          icon: "Gauge",
          rules: [
            {
              id: "uk_speeding_standard",
              title: "Speeding (Fixed Penalty Notice)",
              section: "Section 89 RTRA 1984",
              baseFine: 100,
              points: 3,
              description: "Exceeding speed limits on public roads. Minimum penalty is £100 fine and 3 points, unless offered a speed awareness course.",
              vehicleTypes: ["all"],
              stateOverrides: {
                LDN: { description: "Strict camera networks enforce limits across London. In 20mph zones, fixed penalty notices are strictly £100." }
              }
            }
          ]
        },
        sobriety: {
          name: "Drink & Drug Driving",
          icon: "ShieldAlert",
          rules: [
            {
              id: "uk_drink_driving",
              title: "Drink Driving",
              section: "Section 5(1)(a) RTA 1988",
              baseFine: 1000,
              points: 11,
              description: "Driving or attempting to drive with alcohol levels above limit. In England/Wales/NI, the limit is 35 micrograms of alcohol per 100ml of breath. In Scotland, the limit is lower at 22 micrograms.",
              vehicleTypes: ["all"],
              stateOverrides: {
                SCT: { baseFine: 1500, points: 11, description: "Scotland enforces a zero-tolerance BAC limit of 22mcg/100ml of breath. Stiff penalties apply including minimum 1-year driving ban." }
              }
            }
          ]
        },
        safety_gear: {
          name: "Safety & Seatbelts",
          icon: "Shield",
          rules: [
            {
              id: "uk_no_seatbelt",
              title: "Riding/Driving without Seatbelt",
              section: "Section 14 RTA 1988",
              baseFine: 100,
              points: 0,
              description: "Failure to wear a seatbelt. If taken to court, fine can rise up to £500.",
              vehicleTypes: ["car", "suv", "commercial"],
              stateOverrides: {}
            },
            {
              id: "uk_distracted",
              title: "Using Handheld Phone While Driving",
              section: "Reg 110 RV(U&U)R 1986",
              baseFine: 200,
              points: 6,
              description: "Using a hand-held mobile phone or sat-nav while driving. Immediate £200 fine and 6 penalty points. Drivers who passed test in last 2 years lose license instantly.",
              vehicleTypes: ["all"],
              stateOverrides: {}
            }
          ]
        },
        city_zones: {
          name: "City Emission & Congestion Zones",
          icon: "TrafficCone",
          rules: [
            {
              id: "uk_ulez_violation",
              title: "Non-compliant vehicle in ULEZ Zone",
              section: "TfL London Charging Scheme",
              baseFine: 180,
              points: 0,
              description: "Driving a non-compliant vehicle inside London's Ultra Low Emission Zone without paying the daily £12.50 charge. Reduced to £90 if paid within 14 days.",
              vehicleTypes: ["car", "suv", "motorcycle", "commercial"],
              stateOverrides: {
                LDN: { baseFine: 180, description: "Enforced across all London boroughs. Heavy automatic camera tracking." },
                ENG: { baseFine: 0, description: "Only applicable if driving inside London ULEZ boundary." },
                SCT: { baseFine: 0, description: "Not applicable in Scotland, though Glasgow/Edinburgh have separate Low Emission Zones (LEZs) starting at £60." }
              }
            },
            {
              id: "uk_congestion_charge",
              title: "Failure to pay London Congestion Charge",
              section: "TfL London Charging Scheme",
              baseFine: 160,
              points: 0,
              description: "Failure to pay the daily charge (£15) for driving in central London congestion charging zones during operating hours. Reduced to £80 if paid within 14 days.",
              vehicleTypes: ["car", "suv", "commercial"],
              stateOverrides: {
                LDN: { baseFine: 160 }
              }
            }
          ]
        }
      }
    }
  }
};
