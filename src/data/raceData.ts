export interface RaceCategory {
  id: "5k" | "10k" | "half" | "full";
  name: string;
  distance: string;
  numericKm: number;
  tagline: string;
  description: string;
  startTime: string;
  cutoffTime: string;
  minAge: string;
  fee: number;
  originalFee: number;
  earlyBirdFee: number;
  timed: boolean;
  slotsFilled: number;
  prizePool: string;
  color: string;
  badge: string;
  image: string;
  popular?: boolean;
  hydrationPoints: number;
  perks: string[];
}

export const RACE_DATE_ISO = "2027-02-21T04:30:00+05:30";

export const RACE_CATEGORIES: RaceCategory[] = [
  {
    id: "5k",
    name: "5K Fun Run / Walk",
    distance: "5 KM",
    numericKm: 5,
    tagline: "Great for beginners and families",
    description:
      "A vibrant, non-timed celebration run through Dwarka's tree-lined boulevards with live Dhol beats, Zumba warm-ups, and family photo zones.",
    startTime: "06:45 AM",
    cutoffTime: "90 Mins",
    minAge: "8+ Yrs",
    fee: 799,
    originalFee: 1099,
    earlyBirdFee: 699,
    timed: false,
    slotsFilled: 74,
    prizePool: "Goodie Hampers & Trophies",
    color: "from-emerald-500 via-teal-500 to-cyan-600",
    badge: "BEGINNER & FAMILY",
    image: "/assets/finish-line.jpg",
    hydrationPoints: 2,
    perks: [
      "3D Finisher Medal",
      "AeroMesh Race Tee",
      "Color Souvenir Bib",
      "Hot Post-Run Breakfast",
      "E-Certificate",
    ],
  },
  {
    id: "10k",
    name: "10K Challenge",
    distance: "10 KM",
    numericKm: 10,
    tagline: "Timed run for fitness enthusiasts",
    description:
      "Test your 10K speed on a laser-measured, flat asphalt circuit. Mylaps RFID chip timing with age-group podium awards and qualifier certificate.",
    startTime: "06:15 AM",
    cutoffTime: "2 Hours",
    minAge: "14+ Yrs",
    fee: 1199,
    originalFee: 1499,
    earlyBirdFee: 999,
    timed: true,
    slotsFilled: 89,
    prizePool: "₹1,50,000 Prize Pool",
    color: "from-coral-500 via-orange-500 to-amber-500",
    badge: "MOST POPULAR • SELLING FAST",
    popular: true,
    image: "/assets/hero-runners.jpg",
    hydrationPoints: 4,
    perks: [
      "3D Finisher Medal",
      "Pro Dry-Fit Jersey",
      "Mylaps RFID Timing Chip",
      "Official Split Certificate",
      "Hot Breakfast & Energy Gel",
      "Free HD Race Photos",
    ],
  },
  {
    id: "half",
    name: "Half Marathon (21.1 KM)",
    distance: "21.1 KM",
    numericKm: 21.0975,
    tagline: "Serious endurance run",
    description:
      "Our flagship championship distance! Supported by experienced Pacer Buses (1:45 to 3:00 hrs), isotonic stations, and an electric finish gantry.",
    startTime: "05:30 AM",
    cutoffTime: "3.5 Hours",
    minAge: "18+ Yrs",
    fee: 1599,
    originalFee: 1999,
    earlyBirdFee: 1399,
    timed: true,
    slotsFilled: 82,
    prizePool: "₹3,50,000 Prize Pool",
    color: "from-blue-600 via-indigo-600 to-violet-700",
    badge: "CHAMPIONSHIP QUALIFIER",
    image: "/assets/race-kit-2027.jpg",
    hydrationPoints: 8,
    perks: [
      "Heavy Gold/Navy Medal",
      "Pro Race Singlet/Tee",
      "Mylaps RFID Timing Chip",
      "Major Marathon Qualifier Cert",
      "Dedicated Pacer Support",
      "Ice-Bath & Physio Recovery",
    ],
  },
  {
    id: "full",
    name: "Full Marathon (42.2 KM)",
    distance: "42.2 KM",
    numericKm: 42.195,
    tagline: "Elite endurance test",
    description:
      "The ultimate crown jewel of Delhi Dwarka Run 2027. A fast, flat twin-loop AIMS-grade course built for Boston, Comrades & Abbott Majors qualification.",
    startTime: "04:30 AM",
    cutoffTime: "6 Hours",
    minAge: "18+ Yrs",
    fee: 1999,
    originalFee: 2499,
    earlyBirdFee: 1749,
    timed: true,
    slotsFilled: 68,
    prizePool: "₹5,00,000 Prize Pool",
    color: "from-amber-500 via-coral-500 to-rose-600",
    badge: "ELITE MARATHON",
    image: "/assets/hero-runners.jpg",
    hydrationPoints: 15,
    perks: [
      "Oversized 42.2K Crown Medal",
      "Finisher Pro Tee + Towel",
      "Mylaps Dual RFID Chip",
      "Official Qualifier Certificate",
      "4x Energy Gel & Salt Stations",
      "VIP Recovery Lounge Access",
    ],
  },
];

export const ROUTE_DATA: Record<
  RaceCategory["id"],
  {
    title: string;
    pathDesc: string;
    elevationGain: string;
    waterStations: string;
    landmarks: string[];
    svgPath: string;
    elevationPoints: string;
  }
> = {
  "5k": {
    title: "5K Fun Run Green Boulevard Loop",
    pathDesc:
      "DDA Sports Complex Sec-10 → Sector 6 Market Boulevard → Sector 10 Central Park → Finish at Sports Complex Gate 2",
    elevationGain: "+12m (Flat & Fast)",
    waterStations: "KM 1.5, KM 3.2, Finish Line",
    landmarks: ["Sector 10 Sports Complex", "Sector 6 Green Belt", "Sector 10 Metro Plaza"],
    svgPath: "M 100 220 Q 190 100 320 140 T 470 215 Q 290 290 100 220",
    elevationPoints: "0,80 100,76 200,70 300,74 400,68 500,75 600,80",
  },
  "10k": {
    title: "10K Speed Circuit",
    pathDesc:
      "Sec-10 Sports Complex → Sec-6 Main Rd → Sec-11 Metro Chowk → Sec-9 Ashirwad Chowk → Sec-10 Finish Arch",
    elevationGain: "+24m (100% Paved Asphalt)",
    waterStations: "KM 2.0, KM 4.5, KM 7.0, KM 9.0",
    landmarks: [
      "Sector 10 Sports Complex",
      "Ashirwad Chowk",
      "Sector 11 Metro Station",
      "District Court Boulevard",
    ],
    svgPath:
      "M 85 215 C 130 75, 340 65, 500 135 C 585 185, 480 295, 300 275 C 165 265, 95 245, 85 215",
    elevationPoints: "0,82 100,72 200,62 300,68 400,58 500,70 600,82",
  },
  half: {
    title: "21.1K Half Marathon Championship Course",
    pathDesc:
      "Sec-10 Sports Complex → Sec-6/7 → Sec-20/21 Metro Terminal → Golf Course Road Stretch → Sec-12 City Centre → Sec-10 Finish",
    elevationGain: "+48m (PB Friendly Course)",
    waterStations: "Every 2.5 KM + Electrolytes & Sponge Stations",
    landmarks: [
      "DDA Sports Complex",
      "Dwarka City Centre",
      "Sector 21 Pacific Mall",
      "Bharat Vandana Park Perimeter",
    ],
    svgPath:
      "M 70 215 C 100 55, 300 40, 535 90 C 685 125, 675 285, 500 295 C 315 310, 115 285, 70 215",
    elevationPoints: "0,85 80,74 180,60 280,68 380,48 480,64 600,84",
  },
  full: {
    title: "42.2K Full Marathon Two-Loop Championship",
    pathDesc:
      "Two Championship Loops covering Sector 10, Bharat Vandana Park Avenue, Golf Course Road, Sector 21, and Sector 12",
    elevationGain: "+92m (Certified Flat Asphalt)",
    waterStations: "15 Hydration + 4 Energy Gel & Salt Stations",
    landmarks: [
      "Sector 10 Main Arena",
      "Bharat Vandana Park",
      "Dwarka Expressway Link",
      "Sector 21 Hub",
      "Vegas Mall Avenue",
    ],
    svgPath:
      "M 60 215 C 80 35, 340 20, 585 70 C 720 110, 710 305, 520 310 C 315 315, 100 295, 60 215",
    elevationPoints: "0,86 75,65 160,52 250,75 340,46 430,60 520,50 600,85",
  },
};

export interface RunnerResult {
  bib: string;
  name: string;
  category: string;
  gender: string;
  netTime: string;
  pace: string;
  rank?: number;
  isNew?: boolean;
}

export const INITIAL_RESULTS: RunnerResult[] = [
  {
    bib: "42014",
    name: "Arjun Singh Rathore",
    category: "Full Marathon (42.2 KM)",
    gender: "Male",
    netTime: "02:38:14",
    pace: "3:45 /km",
    rank: 1,
  },
  {
    bib: "42089",
    name: "Meera Nair",
    category: "Full Marathon (42.2 KM)",
    gender: "Female",
    netTime: "02:56:42",
    pace: "4:11 /km",
    rank: 2,
  },
  {
    bib: "21104",
    name: "Vikramaditya Sharma",
    category: "Half Marathon (21.1 KM)",
    gender: "Male",
    netTime: "01:12:09",
    pace: "3:25 /km",
    rank: 1,
  },
  {
    bib: "21256",
    name: "Priyanka Deshmukh",
    category: "Half Marathon (21.1 KM)",
    gender: "Female",
    netTime: "01:21:33",
    pace: "3:52 /km",
    rank: 2,
  },
  {
    bib: "10412",
    name: "Rohan Malhotra",
    category: "10K Challenge",
    gender: "Male",
    netTime: "00:33:48",
    pace: "3:22 /km",
    rank: 1,
  },
  {
    bib: "10881",
    name: "Ananya Verma",
    category: "10K Challenge",
    gender: "Female",
    netTime: "00:38:15",
    pace: "3:49 /km",
    rank: 2,
  },
  {
    bib: "50219",
    name: "Kabir Khanna",
    category: "5K Fun Run / Walk",
    gender: "Male",
    netTime: "00:21:10",
    pace: "4:14 /km",
    rank: 1,
  },
];
