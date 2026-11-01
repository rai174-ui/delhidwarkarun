export interface RaceCategory {
  id: "half" | "10.5k" | "5k" | "3k" | "test1";
  name: string;
  distance: string;
  numericKm: number;
  tagline: string;
  description: string;
  startTime: string;
  cutoffTime: string;
  minAge: string;
  originalFee: number; // Base fee before 50% discount (2200, 2000, 1800, 1600)
  fee: number; // 50% discounted fee valid till 30-Nov-2026 (1100, 1000, 900, 800)
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

export const RACE_DATE_ISO = "2027-02-14T05:30:00+05:30";
export const DISCOUNT_DEADLINE_ISO = "2026-11-30T23:59:59+05:30";
export const START_VENUE = "Max Hospital, Sector 10, Dwarka, New Delhi";

export const RACE_CATEGORIES: RaceCategory[] = [
  {
    id: "half",
    name: "Half Marathon (21.097 KM)",
    distance: "21.097 KM",
    numericKm: 21.097,
    tagline: "Flagship Championship Half Marathon",
    description:
      "The crown jewel of the 4th Edition Dwarka Half Marathon! Flat, fast course starting from Max Hospital Sector 10 with official Pacer Buses, RFID timing, and Lucky Draw entry.",
    startTime: "05:30 AM",
    cutoffTime: "3.5 Hours",
    minAge: "18+ Yrs",
    originalFee: 2200,
    fee: 1100,
    timed: true,
    slotsFilled: 86,
    prizePool: "Trophies, Podium Awards & Lucky Draw",
    color: "from-blue-600 via-indigo-600 to-navy-900",
    badge: "FLAGSHIP 21.097 KM",
    popular: true,
    image: "/assets/hero-runners.jpg",
    hydrationPoints: 8,
    perks: [
      "3D Finisher Medal",
      "Official DDR Dry-Fit Jersey",
      "RFID Timing Chip Bib",
      "Official Timing Certificate",
      "Hot Post-Run Refreshments",
      "Lucky Draw Entry + Free Race Photos",
    ],
  },
  {
    id: "10.5k",
    name: "10.5 KM Challenge",
    distance: "10.5 KM",
    numericKm: 10.5,
    tagline: "Quarter Marathon Timed Challenge",
    description:
      "Push your endurance on Dwarka's scenic tree-lined boulevards starting at Max Hospital Sector 10. Includes RFID timing chip, hydration stations, and Lucky Draw eligibility.",
    startTime: "06:00 AM",
    cutoffTime: "2 Hours",
    minAge: "14+ Yrs",
    originalFee: 2000,
    fee: 1000,
    timed: true,
    slotsFilled: 89,
    prizePool: "Age-Category Podium & Lucky Draw",
    color: "from-coral-500 via-orange-500 to-amber-500",
    badge: "MOST POPULAR • 50% OFF",
    image: "/assets/race-kit-2027.jpg",
    hydrationPoints: 4,
    perks: [
      "3D Finisher Medal",
      "Official DDR Dry-Fit Jersey",
      "RFID Timing Chip Bib",
      "Official Timing Certificate",
      "Hot Post-Run Refreshments",
      "Lucky Draw Entry + Free Race Photos",
    ],
  },
  {
    id: "5k",
    name: "5 KM Run",
    distance: "5 KM",
    numericKm: 5,
    tagline: "High-Energy Fitness Run",
    description:
      "Perfect for fitness enthusiasts, corporate teams, and club runners looking for a fast 5 KM morning run across Sector 10 Dwarka with full race perks.",
    startTime: "06:30 AM",
    cutoffTime: "75 Mins",
    minAge: "10+ Yrs",
    originalFee: 1800,
    fee: 900,
    timed: true,
    slotsFilled: 78,
    prizePool: "Exciting Prizes & Lucky Draw",
    color: "from-emerald-500 via-teal-500 to-cyan-600",
    badge: "FITNESS FAVORITE",
    image: "/assets/finish-line.jpg",
    hydrationPoints: 2,
    perks: [
      "3D Finisher Medal",
      "Official DDR Dry-Fit Jersey",
      "Race Bib with Timing",
      "Digital Finisher Certificate",
      "Hot Post-Run Breakfast & Refreshments",
      "Lucky Draw Entry",
    ],
  },
  {
    id: "3k",
    name: "3 KM Fun Run / Walk",
    distance: "3 KM",
    numericKm: 3,
    tagline: "Great for Beginners, Kids & Families",
    description:
      "Be a part of the biggest running event of Dwarka! A joyful 3 KM community run & walk starting from Max Hospital Sector 10 to create lifetime memories with family.",
    startTime: "06:45 AM",
    cutoffTime: "60 Mins",
    minAge: "6+ Yrs",
    originalFee: 1600,
    fee: 800,
    timed: false,
    slotsFilled: 72,
    prizePool: "Lucky Draw & Finisher Goodies",
    color: "from-purple-600 via-fuchsia-600 to-pink-600",
    badge: "FAMILY & BEGINNERS",
    image: "/assets/finish-line.jpg",
    hydrationPoints: 2,
    perks: [
      "3D Finisher Medal",
      "Official DDR Dry-Fit T-Shirt",
      "Souvenir Race Bib",
      "Participation E-Certificate",
      "Post-Run Refreshments & Zumba",
      "Lucky Draw Entry",
    ],
  },
  {
    id: "test1",
    name: "Gateway Test Payment (₹1)",
    distance: "TEST ₹1",
    numericKm: 1,
    tagline: "Temporary ₹1 Live Payment Gateway Test",
    description:
      "Temporary ₹1 test category to verify live Razorpay payment gateway, order creation, signature verification, and E-Bib generation. Will be removed after testing.",
    startTime: "06:45 AM",
    cutoffTime: "Test Mode",
    minAge: "All",
    originalFee: 2,
    fee: 1,
    timed: false,
    slotsFilled: 10,
    prizePool: "Gateway Verification Test",
    color: "from-amber-500 via-orange-500 to-red-500",
    badge: "TEMP ₹1 TEST",
    image: "/assets/finish-line.jpg",
    hydrationPoints: 1,
    perks: [
      "Live Razorpay ₹1.00 (100 Paise) Checkout Test",
      "Instant Signature Verification Check",
      "Live E-Bib & Database Record Verification",
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
  half: {
    title: "21.097 KM Half Marathon Official Course (2 Loops to Kakrola U-Turn)",
    pathDesc:
      "START at Max Super Speciality Hospital Dwarka (Sec-10) → Welcomhotel By ITC Hotels → Golf Course Rd → Venkateshwar Hospital → Sector 17 Dwarka → U-Turn at Kakrola (10.5 & 21.1 KM Turnaround) → Return to Max Hospital Sec-10 FINISH",
    elevationGain: "+42m (Flat & Fast PB Course)",
    waterStations: "Every 2.5 KM + Max Healthcare & Venkateshwar Hospital Corridor",
    landmarks: [
      "Max Super Speciality Hospital Dwarka (START / FINISH)",
      "Welcomhotel By ITC Hotels, Dwarka",
      "Venkateshwar Hospital & Sector 17 Dwarka",
      "Kakrola U-Turn Point (for 10.5 & 21.1 KM)",
    ],
    svgPath:
      "M 65 215 C 95 55, 300 40, 535 90 C 685 125, 675 285, 500 295 C 315 310, 115 285, 65 215",
    elevationPoints: "0,85 80,74 180,60 280,68 380,48 480,64 600,84",
  },
  "10.5k": {
    title: "10.5 KM Official Course (Turnaround at Kakrola U-Turn)",
    pathDesc:
      "START at Max Super Speciality Hospital Dwarka (Sec-10) → Welcomhotel By ITC Hotels → Golf Course Rd → Venkateshwar Hospital → Sector 17 Dwarka → U-Turn for 10.5 & 21.1 KM at Kakrola → Return to Max Hospital Sec-10 FINISH",
    elevationGain: "+22m (100% Paved Asphalt)",
    waterStations: "KM 2.0, KM 4.5, KM 7.5, KM 9.5 & Finish",
    landmarks: [
      "Max Super Speciality Hospital Dwarka (START / FINISH)",
      "Welcomhotel By ITC Hotels, Dwarka",
      "Venkateshwar Hospital (Sector 18A / 12)",
      "Kakrola U-Turn Point (for 10.5 & 21.1 KM)",
    ],
    svgPath:
      "M 85 215 C 130 75, 340 65, 500 135 C 585 185, 480 295, 300 275 C 165 265, 95 245, 85 215",
    elevationPoints: "0,82 100,72 200,62 300,68 400,58 500,70 600,82",
  },
  "5k": {
    title: "5 KM Run Official Course (Golf Course Rd U-Turn)",
    pathDesc:
      "START at Max Super Speciality Hospital Dwarka (Sec-10) → Welcomhotel By ITC Hotels → Muthoot Finance Gold Loan → U-Turn for 5 KM on Golf Course Rd → Return to Max Hospital Sec-10 FINISH",
    elevationGain: "+12m (Flat & Fast)",
    waterStations: "KM 1.5, KM 3.5 & Finish Arena",
    landmarks: [
      "Max Super Speciality Hospital Dwarka (START / FINISH)",
      "Welcomhotel By ITC Hotels, Dwarka",
      "U-Turn for 5 KM (Golf Course Rd)",
    ],
    svgPath: "M 100 220 Q 190 100 320 140 T 470 215 Q 290 290 100 220",
    elevationPoints: "0,80 100,76 200,70 300,74 400,68 500,75 600,80",
  },
  "3k": {
    title: "3 KM Fun Run Official Course (Muthoot Finance U-Turn)",
    pathDesc:
      "START at Max Super Speciality Hospital Dwarka (Sec-10) → Welcomhotel By ITC Hotels → U-Turn for 3 KM near Muthoot Finance Gold Loan → Return to Max Hospital Sec-10 FINISH",
    elevationGain: "+6m (Super Flat & Safe)",
    waterStations: "KM 1.5 & Finish Line Refreshments",
    landmarks: [
      "Max Super Speciality Hospital Dwarka (START / FINISH)",
      "Welcomhotel By ITC Hotels, Dwarka",
      "U-Turn for 3 KM (Near Muthoot Finance Gold Loan)",
    ],
    svgPath: "M 110 215 Q 180 130 280 160 T 360 215 Q 240 265 110 215",
    elevationPoints: "0,80 150,77 300,75 450,77 600,80",
  },
  test1: {
    title: "Temporary ₹1 Gateway Test Route",
    pathDesc: "START / FINISH at Max Super Speciality Hospital Dwarka (Sector 10)",
    elevationGain: "Flat",
    waterStations: "Start & Finish",
    landmarks: ["Max Super Speciality Hospital Dwarka (START / FINISH)"],
    svgPath: "M 110 215 Q 180 130 280 160 T 360 215 Q 240 265 110 215",
    elevationPoints: "0,80 150,77 300,75 450,77 600,80",
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
    bib: "21104",
    name: "Vikramaditya Sharma",
    category: "Half Marathon (21.097 KM)",
    gender: "Male",
    netTime: "01:12:09",
    pace: "3:25 /km",
    rank: 1,
  },
  {
    bib: "21256",
    name: "Priyanka Deshmukh",
    category: "Half Marathon (21.097 KM)",
    gender: "Female",
    netTime: "01:21:33",
    pace: "3:52 /km",
    rank: 2,
  },
  {
    bib: "10412",
    name: "Rohan Malhotra",
    category: "10.5 KM Challenge",
    gender: "Male",
    netTime: "00:36:18",
    pace: "3:27 /km",
    rank: 1,
  },
  {
    bib: "10881",
    name: "Ananya Verma",
    category: "10.5 KM Challenge",
    gender: "Female",
    netTime: "00:41:05",
    pace: "3:54 /km",
    rank: 2,
  },
  {
    bib: "50219",
    name: "Kabir Khanna",
    category: "5 KM Run",
    gender: "Male",
    netTime: "00:19:40",
    pace: "3:56 /km",
    rank: 1,
  },
  {
    bib: "30115",
    name: "Aarav & Neha Gupta",
    category: "3 KM Fun Run / Walk",
    gender: "Family",
    netTime: "00:16:20",
    pace: "5:26 /km",
    rank: 1,
  },
];
