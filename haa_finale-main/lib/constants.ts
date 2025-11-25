// Centralized constants for dropdowns and predefined options
// Home room presets for quick home creation
export const HOME_PRESETS = [
  { label: "3 Bedrooms / 2 Bathrooms", bedrooms: 3, bathrooms: 2 },
  { label: "2 Bedrooms / 2 Bathrooms", bedrooms: 2, bathrooms: 2 },
  { label: "3 Bedrooms / 2.5 Bathrooms", bedrooms: 3, bathrooms: 2.5 },
  { label: "4 Bedrooms / 3 Bathrooms", bedrooms: 4, bathrooms: 3 }
];

// Other/Professional-only categories for Service Provider creation UI
export const OTHER_SERVICE_PROVIDER_TOP_LEVEL: string[] = [
  "Insurance Providers",
  "Real Estate",
  "Smart Home / Security",
  "Moving / Storage",
];

// Auto-only categories for Service Provider creation UI
export const AUTO_SERVICE_PROVIDER_TOP_LEVEL: string[] = [
  "General Auto Repair",
  "Oil Change / Lube Services",
  "Tires",
  "Brakes",
  "Transmission",
  "Engine Services",
  "Electrical / Battery",
  "Suspension / Steering",
  "Exhaust / Muffler",
  "AC / Heating",
  "Detailing / Car Wash",
  "Auto Glass",
  "Body Shop / Collision",
  "Car Electronics",
  "Performance Upgrades",
];

export const ROOM_TYPES = [
  "Living Room",
  "Family Room / Den",
  "Dining Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom (Child/Guest/Other)",
  "Nursery",
  "Master Bathroom",
  "Full Bathroom",
  "Half Bathroom / Powder Room",
  "Laundry Room",
  "Mudroom",
  "Pantry",
  "Closet / Walk-in Closet",
  "Garage",
  "Finished Basement",
  "Unfinished Basement",
  "Attic",
  "Home Office",
  "Playroom",
  "Home Gym",
  "Media Room / Theater",
  "Game Room",
  "Patio / Deck",
  "Porch",
  "Balcony",
  "Backyard / Garden"
];

// Hierarchical mapping for room categories to types
export const ROOM_CATEGORY_MAP: Record<string, string[]> = {
  "Main Living Areas": [
    "Living Room",
    "Family Room / Den",
    "Dining Room",
    "Kitchen"
  ],
  Bedrooms: ["Master Bedroom", "Bedroom (Child/Guest/Other)", "Nursery"],
  Bathrooms: [
    "Master Bathroom",
    "Full Bathroom",
    "Half Bathroom / Powder Room"
  ],
  "Utility / Functional": [
    "Laundry Room",
    "Mudroom",
    "Pantry",
    "Closet / Walk-in Closet",
    "Garage"
  ],
  "Basement / Attic": [
    "Finished Basement",
    "Unfinished Basement",
    "Attic"
  ],
  "Office / Recreation": [
    "Home Office",
    "Playroom",
    "Home Gym",
    "Media Room / Theater",
    "Game Room"
  ],
  "Outdoor Spaces": [
    "Patio / Deck",
    "Porch",
    "Balcony",
    "Backyard / Garden"
  ]
};

export const HOME_SERVICE_CATEGORIES_INSIDE = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance Repair",
  "Flooring Repair",
  "Painting",
  "Lighting Install/Repair",
  "Drywall Repair / Patching",
  "Pest Control",
  "Cleaning Services",
  "Kitchen Remodel",
  "Bathroom Remodel",
  "Flooring Installation",
  "Smart Home Devices",
  "Furniture Assembly / Installation",
  "Interior Design / Decorating"
];

export const HOME_SERVICE_CATEGORIES_OUTSIDE = [
  "Lawn Care",
  "Tree & Bush Trimming / Removal",
  "Irrigation System Install / Repair",
  "Gutter Cleaning & Repair",
  "Power Washing",
  "Roof Repair / Inspection",
  "Fence Repair / Maintenance",
  "Pest Control (Yard)",
  "Deck / Patio Build or Repair",
  "Fence Installation",
  "Exterior Painting / Siding Work",
  "Outdoor Lighting Install",
  "Driveway / Concrete Work",
  "Landscaping",
  "Outdoor Furniture Assembly",
  "Pool Install / Maintenance"
];

export const VEHICLE_SERVICE_TYPES = [
  "Oil & Filter Change",
  "Tire Rotation / Balance",
  "Brake Service",
  "Battery Replacement",
  "Air Filter Replacement",
  "Wiper Blade Replacement",
  "Fluid Checks & Top-offs",
  "Scheduled Maintenance / Tune-up",
  "Tire Replacement / Flat Repair",
  "Check Engine Light Diagnostics",
  "Alternator / Starter Repair",
  "Suspension / Shock & Strut Replacement",
  "Exhaust / Muffler Repair",
  "AC / Heating Service",
  "Transmission Service / Repair"
];

// Simplified core maintenance service types for quick entry
export const CORE_VEHICLE_MAINTENANCE_TYPES = [
  "Oil & Filter Change",
  "Tire Rotation / Balance",
  "Brake Service (pads, rotors, fluid)",
  "Battery Replacement",
  "Air Filter Replacement (engine & cabin)",
  "Wiper Blade Replacement",
  "Fluid Checks & Top-offs (coolant, transmission, brake, power steering)",
  "Scheduled Maintenance / Tune-up"
];

export const VEHICLE_REPAIR_ISSUES = [
  "Engine",
  "Transmission",
  "Brakes",
  "Electrical",
  "Suspension",
  "Cooling System",
  "Fuel System",
  "Other"
];

export const WARRANTY_OPTIONS = [
  "No Warranty",
  "6 months",
  "1 year",
  "2 years",
  "Other"
];

export const LABOR_PART_WARRANTY = [
  "30 days",
  "90 days",
  "1 year",
  "Custom"
];

// Consolidated list of common home systems/services for maintenance records
export const HOME_MAINTENANCE_SYSTEMS = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Appliance",
  "Roofing",
  "Flooring",
  "Painting",
  "Pest Control",
  "Landscaping",
  "Gutter Cleaning",
  "Garage Door",
  "Water Heater",
  "Foundation",
  "Pool / Spa",
  "Security System",
  "Other"
];

export const HOME_IMPROVEMENT_MATERIAL_CATEGORIES = [
  "Paint",
  "Flooring",
  "Lighting",
  "Furniture"
];

export const SERVICE_PROVIDER_CATEGORIES = {
  Home: {
    Plumbing: [
      "General Plumbing",
      "Leak Detection & Repair",
      "Water Heater Service / Replacement",
      "Pipe Installation / Replacement",
      "Sewer / Drain Cleaning"
    ],
    Electrical: [
      "General Electrical",
      "Wiring & Rewiring",
      "Outlet / Switch Installation",
      "Ceiling Fan / Lighting Fixtures",
      "Panel Upgrades"
    ],
    HVAC: ["Heating", "Cooling", "Duct Cleaning", "Thermostat / Smart Controls"],
    ApplianceRepair: [
      "Kitchen Appliances",
      "Laundry Appliances",
      "Small Appliance Repair"
    ],
    Flooring: ["Carpet Install / Repair", "Hardwood / Laminate", "Tile / Stone", "Vinyl / LVP"],
    Painting: ["Interior Painting", "Exterior Painting", "Staining (Decks, Fences)"],
    Roofing: ["Roof Inspection", "Roof Repair", "Roof Replacement"],
    Landscaping: [
      "Lawn Mowing / Maintenance",
      "Fertilization / Aeration",
      "Mulching / Planting",
      "Sod Installation"
    ],
    TreeServices: ["Trimming / Pruning", "Tree Removal", "Stump Grinding"],
    Irrigation: ["Installation", "Repair / Maintenance"],
    GutterServices: ["Cleaning", "Repair / Replacement"],
    PestControl: ["Termites", "Rodents", "General Pest Control"],
    Remodeling: ["Kitchen Remodel", "Bathroom Remodel", "Basement Remodel", "General Renovation"],
    DeckPatio: ["New Construction", "Repair / Refinishing"],
    FenceServices: ["Installation", "Repair"],
    CleaningServices: ["Residential Cleaning", "Commercial Cleaning", "Carpet / Upholstery Cleaning"],
    Pools: ["Installation", "Maintenance / Cleaning"]
  },
  Auto: {
    GeneralAutoRepair: ["Diagnostics", "Scheduled Maintenance", "Tune-ups"],
    OilChange: ["Conventional Oil Change", "Synthetic Oil Change"],
    Tires: ["Tire Rotation", "Tire Replacement", "Wheel Alignment", "Balancing"],
    Brakes: ["Brake Pads / Rotors", "Brake Fluid Service"],
    Transmission: ["Fluid Service", "Transmission Repair"],
    EngineServices: ["Diagnostics", "Engine Rebuild / Replacement"],
    ElectricalBattery: ["Battery Replacement", "Alternator / Starter Repair", "Wiring / Electrical Diagnostics"],
    SuspensionSteering: ["Shock / Strut Replacement", "Steering System Repair"],
    ExhaustMuffler: ["Muffler Replacement", "Exhaust System Repair"],
    ACHeating: ["AC Recharge", "Heater Core Repair"],
    Detailing: ["Exterior Wash / Wax", "Interior Detailing"],
    AutoGlass: ["Windshield Replacement", "Window Repair"],
    BodyShop: ["Dent / Scratch Repair", "Collision Work", "Paint / Refinishing"],
    CarElectronics: ["Audio Installation", "Navigation Systems", "Dash Cameras"],
    PerformanceUpgrades: ["Custom Exhausts", "Suspension Upgrades", "Engine Tuning"]
  },
  Other: {
    InsuranceProviders: ["Home Insurance", "Auto Insurance", "Bundled Services"],
    RealEstate: ["Real Estate Agents", "Property Inspectors"],
    SmartHomeSecurity: ["Camera Installations", "Alarm Systems", "Smart Devices"],
    MovingStorage: ["Moving Companies", "Storage Facilities"]
  }
};

export const SERVICE_PROVIDER_CATEGORY_MAP: Record<string, string[]> = {
  Plumbing: [
    "General Plumbing",
    "Leak Detection & Repair",
    "Faucets",
    "Toilets",
    "Water Heater Service / Replacement",
    "Pipe Installation / Replacement",
    "Sewer / Drain Cleaning"
  ],
  Electrical: [
    "General Electrical",
    "Wiring",
    "Outlets",
    "Switches",
    "Ceiling Fans",
    "Lighting Fixtures",
    "Panel Upgrades"
  ],
  HVAC: [
    "Heating (Furnace, Boiler)",
    "Cooling (AC Units, Mini-Split)",
    "Duct Cleaning",
    "Thermostat / Smart Controls"
  ],
  "Appliance Repair": [
    "Kitchen Appliances (Fridge, Oven, Dishwasher)",
    "Laundry Appliances (Washer, Dryer)",
    "Small Appliance Repair"
  ],
  Flooring: [
    "Carpet Install / Repair",
    "Hardwood / Laminate",
    "Tile / Stone",
    "Vinyl / LVP"
  ],
  "Flooring Repair": [
    "Tile / Stone",
    "Carpet Install / Repair",
    "Hardwood / Laminate"
  ],
  Painting: ["Interior Painting", "Exterior Painting", "Staining"],
  "Lighting Install / Repair": [
    "Fixtures",
    "Recessed Lighting",
    "Dimmers"
  ],
  "Drywall Repair / Patching": [
    "Small Patches",
    "Large Repairs",
    "Texturing"
  ],
  Roofing: ["Roof Inspection", "Roof Repair", "Roof Replacement"],
  "Landscaping / Lawn Care": [
    "Lawn Mowing / Maintenance",
    "Fertilization / Aeration",
    "Mulching / Planting",
    "Sod Installation"
  ],
  "Tree Services": ["Trimming / Pruning", "Tree Removal", "Stump Grinding"],
  "Irrigation / Sprinklers": ["Installation", "Repair / Maintenance"],
  "Gutter Services": ["Cleaning", "Repair / Replacement"],
  "Pest Control": [
    "Termites",
    "Rodents",
    "General Pest Control"
  ],
  "Remodeling / Renovation": [
    "Kitchen Remodel",
    "Bathroom Remodel",
    "Basement Remodel",
    "General Renovation"
  ],
  "Deck / Patio": ["New Construction", "Repair / Refinishing"],
  "Fence Services": [
    "Installation (Wood, Vinyl, Chain Link)",
    "Repair"
  ],
  "Cleaning Services": [
    "Residential Cleaning",
    "Commercial Cleaning",
    "Carpet / Upholstery Cleaning"
  ],
  "Exterior Painting / Siding Work": [
    "Exterior Painting",
    "Siding Repair",
    "Siding Installation"
  ],
  "Outdoor Lighting Install": [
    "Path Lights",
    "Spot / Flood Lights",
    "String / Decorative Lighting"
  ],
  "Driveway / Concrete Work": [
    "New Concrete",
    "Resurfacing",
    "Crack Repair"
  ],
  Pools: ["Installation", "Maintenance / Cleaning"],
  "Furniture Assembly / Installation": [
    "Assembly",
    "Mounting",
    "Disassembly"
  ],
  "Interior Design / Decorating": [
    "Space Planning",
    "Color Consultation",
    "Decor Selection"
  ],
  "General Auto Repair": ["Diagnostics", "Scheduled Maintenance", "Tune-ups"],
  "Oil Change / Lube Services": [
    "Conventional Oil Change",
    "Synthetic Oil Change"
  ],
  Tires: [
    "Tire Rotation",
    "Tire Replacement",
    "Wheel Alignment",
    "Balancing"
  ],
  Brakes: ["Brake Pads / Rotors", "Brake Fluid Service"],
  Transmission: ["Fluid Service", "Transmission Repair"],
  "Engine Services": ["Diagnostics", "Engine Rebuild / Replacement"],
  "Electrical / Battery": [
    "Battery Replacement",
    "Alternator / Starter Repair",
    "Wiring / Electrical Diagnostics"
  ],
  "Suspension / Steering": [
    "Shock / Strut Replacement",
    "Steering System Repair"
  ],
  "Exhaust / Muffler": ["Muffler Replacement", "Exhaust System Repair"],
  "AC / Heating": ["AC Recharge", "Heater Core Repair"],
  "Detailing / Car Wash": ["Exterior Wash / Wax", "Interior Detailing"],
  "Auto Glass": ["Windshield Replacement", "Window Repair"],
  "Body Shop / Collision": [
    "Dent / Scratch Repair",
    "Collision Work",
    "Paint / Refinishing"
  ],
  "Car Electronics": [
    "Audio Installation",
    "Navigation Systems",
    "Dash Cameras"
  ],
  "Performance Upgrades": [
    "Custom Exhausts",
    "Suspension Upgrades",
    "Engine Tuning"
  ],
  "Insurance Providers": ["Home Insurance", "Auto Insurance", "Bundled Services"],
  "Real Estate": ["Real Estate Agents", "Property Inspectors"],
  "Smart Home / Security": [
    "Thermostats",
    "Camera Installations",
    "Alarm Systems",
    "Smart Devices"
  ],
  "Moving / Storage": ["Moving Companies", "Storage Facilities"],
  Other: ["General / Misc"]
};

export const SERVICE_PROVIDER_TOP_LEVEL_CATEGORIES = Object.keys(SERVICE_PROVIDER_CATEGORY_MAP);

// Home-only categories for Service Provider creation UI
export const HOME_SERVICE_PROVIDER_TOP_LEVEL: string[] = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance Repair",
  "Flooring",
  "Painting",
  "Roofing",
  "Landscaping / Lawn Care",
  "Tree Services",
  "Irrigation / Sprinklers",
  "Gutter Services",
  "Pest Control",
  "Remodeling / Renovation",
  "Deck / Patio",
  "Fence Services",
  "Cleaning Services",
  "Pools",
];

// Comprehensive vehicle makes and models covering all major manufacturers
export const VEHICLE_MAKES = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Dacia",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Genesis",
  "GMC",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jaguar",
  "Jeep",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Maserati",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "MG",
  "MINI",
  "Mitsubishi",
  "Nissan",
  "Peugeot",
  "Porsche",
  "Ram",
  "Renault",
  "Rolls-Royce",
  "Seat",
  "Skoda",
  "Smart",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "Vauxhall",
  "Volkswagen",
  "Volvo",
  "Other"
];

export const VEHICLE_MODELS: Record<string, string[]> = {
  Acura: ["ILX", "TLX", "RLX", "MDX", "RDX", "NSX", "Integra"],
  "Alfa Romeo": ["Giulia", "Stelvio", "4C", "Tonale"],
  "Aston Martin": ["DB11", "DBS", "Vantage", "DBX", "Rapide"],
  Audi: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne"],
  BMW: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX"],
  Buick: ["Enclave", "Encore", "Envision", "Regal", "LaCrosse"],
  Cadillac: ["CT4", "CT5", "CT6", "XT4", "XT5", "XT6", "Escalade", "Lyriq"],
  Chevrolet: ["Spark", "Sonic", "Cruze", "Malibu", "Impala", "Camaro", "Corvette", "Blazer", "Equinox", "Traverse", "Tahoe", "Suburban", "Silverado", "Colorado", "Bolt EV", "Bolt EUV"],
  Chrysler: ["300", "Pacifica", "Voyager"],
  Citroen: ["C1", "C3", "C4", "C5 Aircross", "Berlingo", "SpaceTourer"],
  Dacia: ["Sandero", "Duster", "Logan", "Spring"],
  Dodge: ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan"],
  Ferrari: ["488", "812 Superfast", "F8 Tributo", "Roma", "Portofino", "SF90 Stradale"],
  Fiat: ["500", "500X", "500L", "Panda", "Tipo"],
  Ford: ["Fiesta", "Focus", "Fusion", "Mustang", "EcoSport", "Escape", "Edge", "Explorer", "Expedition", "Bronco", "Bronco Sport", "F-150", "F-250", "F-350", "Ranger", "Maverick", "Transit"],
  Genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  GMC: ["Terrain", "Acadia", "Yukon", "Sierra 1500", "Sierra 2500HD", "Sierra 3500HD", "Canyon"],
  Honda: ["Fit", "Civic", "Accord", "Insight", "Clarity", "CR-V", "HR-V", "Passport", "Pilot", "Ridgeline", "Odyssey"],
  Hyundai: ["Accent", "Elantra", "Sonata", "Veloster", "Ioniq", "Kona", "Tucson", "Santa Fe", "Palisade", "Venue", "Ioniq 5", "Ioniq 6"],
  Infiniti: ["Q50", "Q60", "Q70", "QX30", "QX50", "QX55", "QX60", "QX80"],
  Jaguar: ["XE", "XF", "XJ", "F-Type", "E-Pace", "F-Pace", "I-Pace"],
  Jeep: ["Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Renegade", "Wagoneer", "Grand Wagoneer"],
  Kia: ["Rio", "Forte", "K5", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "Carnival", "Niro", "EV6"],
  Lamborghini: ["Huracan", "Aventador", "Urus"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar", "Discovery", "Discovery Sport", "Defender"],
  Lexus: ["IS", "ES", "GS", "LS", "RC", "LC", "UX", "NX", "RX", "GX", "LX", "RZ"],
  Lincoln: ["Corsair", "Nautilus", "Aviator", "Navigator"],
  Lotus: ["Elise", "Exige", "Evora", "Emira"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "MC20", "GranTurismo", "GranCabrio"],
  Mazda: ["Mazda2", "Mazda3", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-50", "CX-9", "CX-90", "MX-5 Miata", "MX-30"],
  McLaren: ["570S", "600LT", "720S", "765LT", "GT", "Artura"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "EQB", "EQC", "EQE", "EQS"],
  MG: ["MG3", "MG4", "MG5", "HS", "ZS"],
  MINI: ["Cooper", "Cooper S", "Clubman", "Countryman", "Convertible", "Electric"],
  Mitsubishi: ["Mirage", "Lancer", "Eclipse Cross", "Outlander", "Outlander Sport", "Outlander PHEV"],
  Nissan: ["Versa", "Sentra", "Altima", "Maxima", "370Z", "GT-R", "Kicks", "Rogue", "Rogue Sport", "Murano", "Pathfinder", "Armada", "Frontier", "Titan", "Leaf", "Ariya"],
  Peugeot: ["108", "208", "308", "508", "2008", "3008", "5008", "Rifter"],
  Porsche: ["718 Cayman", "718 Boxster", "911", "Panamera", "Cayenne", "Macan", "Taycan"],
  Ram: ["1500", "2500", "3500", "ProMaster", "ProMaster City"],
  Renault: ["Clio", "Captur", "Megane", "Kadjar", "Koleos", "Scenic", "Zoe"],
  "Rolls-Royce": ["Ghost", "Phantom", "Wraith", "Dawn", "Cullinan"],
  Seat: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
  Skoda: ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
  Smart: ["fortwo", "forfour", "EQ fortwo", "EQ forfour"],
  Subaru: ["Impreza", "Legacy", "Outback", "Forester", "Crosstrek", "Ascent", "WRX", "BRZ", "Solterra"],
  Suzuki: ["Swift", "Baleno", "Vitara", "S-Cross", "Jimny", "Ignis"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck", "Roadster"],
  Toyota: ["Yaris", "Corolla", "Camry", "Avalon", "Prius", "86", "Supra", "C-HR", "RAV4", "Venza", "Highlander", "4Runner", "Sequoia", "Land Cruiser", "Tacoma", "Tundra", "Sienna", "bZ4X"],
  Vauxhall: ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo"],
  Volkswagen: ["Polo", "Golf", "Jetta", "Arteon", "Passat", "T-Roc", "Tiguan", "Atlas", "Taos", "ID.4", "ID. Buzz"],
  Volvo: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C40", "EX30", "EX90"],
  Other: ["Custom", "Other Make"]
};

// Recommended default mileage intervals for next due calculations (miles)
export const VEHICLE_SERVICE_DEFAULT_INTERVALS: Record<string, number> = {
  "Oil & Filter Change": 5000,
  "Tire Rotation / Balance": 6000,
  "Brake Service (pads, rotors, fluid)": 12000,
};

// Recommended default date intervals (months) for date-based services
export const VEHICLE_SERVICE_DEFAULT_MONTH_INTERVALS: Record<string, number> = {
  "Scheduled Maintenance / Tune-up": 6,
};
