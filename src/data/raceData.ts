export interface RaceCategory {
  id: "5k" | "10k" | "half" | "full";
  name: string;
  distance: string;
  tagline: string;
  description: string;
  startTime: string;
  cutoffTime: string;
  minAge: string;
  fee: number;
  earlyBirdFee: number;
  timed: boolean;
  color: string;
  badge: string;
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
    tagline: "Great for beginners and families",
    description:
      "An energetic, non-timed community run & walk through Dwarka's scenic green boulevards. Ideal for first-timers, families, students, and senior citizens.",
    startTime: "06:45 AM IST",
    cutoffTime: "1 Hr 30 Mins",
    minAge: "8+ Years",
    fee: 799,
    earlyBirdFee: 699,
    timed: false,
    color: "from-emerald-500 to-teal-600",
    badge: "Family Favorite",
    hydrationPoints: 2,
    perks: [
      "Finisher Medal",
      "Dry-Fit Race Tee",
      "Race Bib (Non-Timed)",
      "Hot Breakfast & Refreshments",
      "Digital Participation Certificate",
    ],
  },
  {
    id: "10k",
    name: "10K Challenge",
    distance: "10 KM",
    tagline: "Timed run for fitness enthusiasts",
    description:
      "Push your pace on a flat, fast, AIMS-measured course across Dwarka Sector 10 & 11. Includes an official RFID timing chip and age-category podium rankings.",
    startTime: "06:15 AM IST",
    cutoffTime: "2 Hours",
    minAge: "14+ Years",
    fee: 1199,
    earlyBirdFee: 999,
    timed: true,
    color: "from-coral-500 to-orange-600",
    badge: "Most Popular",
    popular: true,
    hydrationPoints: 4,
    perks: [
      "Finisher Medal",
      "Pro Dry-Fit Tee",
      "RFID Timing Chip Bib",
      "Official Timing Certificate",
      "Hot Breakfast & Energy Drink",
      "Free Race Photos",
    ],
  },
  {
    id: "half",
    name: "Half Marathon (21.1 KM)",
    distance: "21.1 KM",
    tagline: "Serious endurance run",
    description:
      "The signature Delhi Dwarka Run experience. Fast asphalt stretches, dedicated pace-makers (1:45 to 3:00 hrs), and roaring neighborhood cheering zones.",
    startTime: "05:30 AM IST",
    cutoffTime: "3 Hrs 30 Mins",
    minAge: "18+ Years",
    fee: 1599,
    earlyBirdFee: 1399,
    timed: true,
    color: "from-blue-600 to-indigo-700",
    badge: "Qualifier Standard",
    hydrationPoints: 8,
    perks: [
      "Heavy Die-Cast Medal",
      "Pro Dry-Fit Singlet/Tee",
      "RFID Timing Chip Bib",
      "Official Timing Certificate",
      "Pace-Maker Support",
      "Post-Run Recovery Zone & Breakfast",
    ],
  },
  {
    id: "full",
    name: "Full Marathon (42.2 KM)",
    distance: "42.2 KM",
    tagline: "Elite endurance test",
    description:
      "The ultimate test of grit and stamina across New Delhi's sub-city. Flat twin-loop championship route with elite hydration, energy gels, and medical stations.",
    startTime: "04:30 AM IST",
    cutoffTime: "6 Hours",
    minAge: "18+ Years",
    fee: 1999,
    earlyBirdFee: 1749,
    timed: true,
    color: "from-navy-800 to-navy-950",
    badge: "Elite Championship",
    hydrationPoints: 15,
    perks: [
      "Championship Finisher Medal",
      "Elite Finisher Jacket/Tee",
      "RFID Timing Chip Bib",
      "AIMS/Qualifier Certificate",
      "Energy Gel Stations",
      "Dedicated Physio & Ice Bath Recovery",
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
  }
> = {
  "5k": {
    title: "5K Fun Run Loop",
    pathDesc:
      "DDA Sports Complex Sec-10 → Sector 6 Market Boulevard → Sector 10 Central Park → Finish at Sports Complex Gate 2",
    elevationGain: "12m (Flat & Fast)",
    waterStations: "KM 1.5, KM 3.2, Finish Line",
    landmarks: ["Sector 10 Sports Complex", "Sector 6 Green Belt", "Sector 10 Metro Plaza"],
    svgPath: "M 90 210 Q 170 110 290 150 T 430 210 Q 280 280 90 210",
  },
  "10k": {
    title: "10K Speed Circuit",
    pathDesc:
      "Sec-10 Sports Complex → Sec-6 Main Rd → Sec-11 Metro Chowk → Sec-9 Ashirwad Chowk → Sec-10 Finish Arch",
    elevationGain: "24m (100% Paved Asphalt)",
    waterStations: "KM 2.0, KM 4.5, KM 7.0, KM 9.0",
    landmarks: [
      "Sector 10 Sports Complex",
      "Ashirwad Chowk",
      "Sector 11 Metro Station",
      "District Court Boulevard",
    ],
    svgPath:
      "M 80 210 C 120 80, 320 70, 480 140 C 560 190, 460 290, 290 270 C 160 260, 90 240, 80 210",
  },
  half: {
    title: "21.1K Half Marathon Championship Course",
    pathDesc:
      "Sec-10 Sports Complex → Sec-6/7 → Sec-20/21 Metro Terminal → Golf Course Road Stretch → Sec-12 City Centre → Sec-10 Finish",
    elevationGain: "48m (PB Friendly Course)",
    waterStations: "Every 2.5 KM + Electrolytes & Sponge Stations",
    landmarks: [
      "DDA Sports Complex",
      "Dwarka City Centre",
      "Sector 21 Pacific Mall",
      "Bharat Vandana Park Perimeter",
    ],
    svgPath:
      "M 65 215 C 95 60, 290 45, 520 95 C 670 130, 660 280, 490 295 C 310 310, 110 280, 65 215",
  },
  full: {
    title: "42.2K Full Marathon Two-Loop Championship",
    pathDesc:
      "Two Championship Loops covering Sector 10, Bharat Vandana Park Avenue, Golf Course Road, Sector 21, and Sector 12",
    elevationGain: "92m (Certified Flat Asphalt)",
    waterStations: "15 Hydration + 4 Energy Gel & Salt Stations",
    landmarks: [
      "Sector 10 Main Arena",
      "Bharat Vandana Park",
      "Dwarka Expressway Link",
      "Sector 21 Hub",
      "Vegas Mall Avenue",
    ],
    svgPath:
      "M 55 215 C 75 40, 330 25, 570 75 C 710 115, 700 305, 510 310 C 310 315, 95 295, 55 215",
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
