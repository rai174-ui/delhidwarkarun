"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  RACE_CATEGORIES,
  RACE_DATE_ISO,
  ROUTE_DATA,
  INITIAL_RESULTS,
  RaceCategory,
  RunnerResult,
} from "../data/raceData";
import RegistrationModal from "../components/RegistrationModal";

const KIT_HOTSPOTS = [
  {
    id: "jersey",
    title: "130 GSM AeroMesh Pro Race Jersey",
    desc: "Laser-perforated sweat-wicking fabric in signature Deep Navy with Neon Coral speed stripes and reflective 3M back print.",
    spec: "UV-40+ Protection • Anti-Chafe Flatlock Seams",
  },
  {
    id: "medal",
    title: "3D Zinc-Alloy Finisher Medal (85mm)",
    desc: "Heavyweight antique gold & navy enamel medallion with embossed Delhi/Dwarka architecture and satin coral lanyard.",
    spec: "Weight: 145g • Free Laser Time Engraving at Expo",
  },
  {
    id: "bib",
    title: "Mylaps Dual-Chip Waterproof Tyvek Bib",
    desc: "Tear-proof, sweat-resistant race bib pre-fitted with disposable Mylaps BibTag RFID foam transponders for instant net-time splits.",
    spec: "Corral Wave A/B/C/D Color-Coded",
  },
  {
    id: "hydration",
    title: "Post-Run Hot Breakfast & Finisher Sipper",
    desc: "Every finisher receives a hot breakfast box, electrolyte recovery drink, banana, protein bar, and finisher refreshment kit.",
    spec: "Served Hot from 05:45 AM at Finish Festival",
  },
];

const RACE_DAY_SCHEDULE = [
  { time: "03:45 AM", event: "Assembly, Baggage Counter & Warm-Up Arena Opens", tag: "Arena Gate 1" },
  { time: "04:30 AM", event: "42.2 KM Full Marathon Flag-Off", tag: "Wave A & B" },
  { time: "05:30 AM", event: "21.1 KM Half Marathon Flag-Off", tag: "Wave A, B & C" },
  { time: "06:15 AM", event: "10 KM Challenge Flag-Off", tag: "Timed Corrals" },
  { time: "06:45 AM", event: "5 KM Fun Run / Walk Flag-Off", tag: "Open / Family" },
  { time: "07:30 AM", event: "Podium Prize Ceremony, Live Dhol & Zumba Festival", tag: "Main Stage" },
];

const FAQS = [
  {
    q: "Where and when is the Bib & Race Kit Expo?",
    a: "The Bib & Goodie Bag Distribution Expo takes place on Friday, Feb 19 & Saturday, Feb 20, 2027 (10:00 AM to 07:00 PM) at DDA Sports Complex Indoor Hall, Sector 10, Dwarka. Outstation runners can opt for verified representative pickup.",
  },
  {
    q: "Is the Delhi Dwarka Run 2027 timing certificate valid for other marathons?",
    a: "Yes! All 10K, Half Marathon (21.1K), and Full Marathon (42.2K) finishers receive an official Mylaps RFID-timed certificate accepted as a qualifier for Tata Mumbai Marathon, Vedanta Delhi Half Marathon, and Comrades.",
  },
  {
    q: "Are there baggage counters, parking, and metro access at the venue?",
    a: "Yes. Free secure baggage counters and parking for 2,500+ vehicles are available at Sector 10 Ground. Dwarka Sector 10 Metro Station (Blue Line) is just 300 meters from the Start/Finish gantry.",
  },
  {
    q: "Can I change my race category or transfer my bib after registering?",
    a: "Category upgrades/downgrades are permitted through your runner dashboard until January 31, 2027. Use code DWARKA2027 during checkout for a 10% early-bird discount.",
  },
];

export default function DelhiDwarkaRunPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroBgVideo, setHeroBgVideo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RaceCategory>(
    RACE_CATEGORIES[1]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRouteTab, setActiveRouteTab] = useState<RaceCategory["id"]>("half");
  const [activeHotspot, setActiveHotspot] = useState(KIT_HOTSPOTS[0]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [resultsQuery, setResultsQuery] = useState("");
  const [resultsCategoryFilter, setResultsCategoryFilter] = useState("All");
  const [registrations, setRegistrations] = useState<RunnerResult[]>([]);
  const [openFaq, setOpenFaq] = useState(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Target Pace Calculator state
  const [calcDist, setCalcDist] = useState(21.0975);
  const [calcHours, setCalcHours] = useState(1);
  const [calcMins, setCalcMins] = useState(55);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(RACE_DATE_ISO).getTime();
    const updateCountdown = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const paceResult = useMemo(() => {
    const totalMinutes = Number(calcHours) * 60 + Number(calcMins);
    if (totalMinutes <= 0 || calcDist <= 0)
      return { pace: "0:00", speed: "0.0", corral: "Wave C" };
    const minPerKm = totalMinutes / calcDist;
    const pMins = Math.floor(minPerKm);
    const pSecs = Math.round((minPerKm - pMins) * 60);
    const speedKmh = ((calcDist / totalMinutes) * 60).toFixed(1);
    let corral = "Wave C (Open Pacer)";
    if (minPerKm < 4.5) corral = "Wave A (Elite / Sub-4:30 Pace)";
    else if (minPerKm < 5.8) corral = "Wave B (Fast Club / Pacer Bus)";
    return {
      pace: `${pMins}:${String(pSecs === 60 ? 59 : pSecs).padStart(2, "0")}`,
      speed: speedKmh,
      corral,
    };
  }, [calcDist, calcHours, calcMins]);

  const handleOpenRegister = (categoryObj?: RaceCategory) => {
    if (categoryObj) {
      setSelectedCategory(categoryObj);
    }
    setIsModalOpen(true);
  };

  const filteredResults = useMemo(() => {
    const allEntries = [...registrations, ...INITIAL_RESULTS];
    return allEntries.filter((r) => {
      const matchesQuery =
        r.name.toLowerCase().includes(resultsQuery.toLowerCase()) ||
        r.bib.toLowerCase().includes(resultsQuery.toLowerCase());
      const matchesCat =
        resultsCategoryFilter === "All" || r.category === resultsCategoryFilter;
      return matchesQuery && matchesCat;
    });
  }, [resultsQuery, resultsCategoryFilter, registrations]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HIGH-ENERGY TICKER MARQUEE */}
      <div className="bg-gradient-to-r from-coral-600 via-coral-500 to-orange-500 text-white py-2 overflow-hidden border-b border-white/15">
        <div className="animate-marquee flex items-center gap-10 text-xs font-display font-extrabold uppercase tracking-wider">
          {[1, 2].map((loop) => (
            <React.Fragment key={loop}>
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-navy-950 text-volt rounded text-[10px]">LIVE</span>
                DELHI DWARKA RUN 2027 • SUNDAY, FEB 21, 2027
              </span>
              <span>⚡ AIMS CERTIFIED FAST ASPHALT COURSE</span>
              <span>🏆 ₹10,00,000+ TOTAL PRIZE POOL</span>
              <span>
                🎟️ EARLY BIRD CODE: <u className="text-navy-950 font-black">DWARKA2027</u> (10% OFF)
              </span>
              <span>⏱️ MYLAPS BIBTAG RFID CHIP TIMING</span>
              <span>📍 DDA SPORTS COMPLEX, SECTOR 10, DWARKA</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STICKY PRO ATHLETIC NAVBAR */}
      <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-500 via-orange-500 to-amber-500 flex items-center justify-center shadow-glow group-hover:rotate-3 transition-transform relative">
              <span className="font-athletic font-bold text-2xl tracking-wider text-white leading-none pt-1">
                DDR
              </span>
              <span className="absolute -bottom-1 -right-1 bg-volt text-navy-950 text-[9px] font-display font-black px-1.5 py-0.2 rounded">
                27
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-white">
                  DELHI DWARKA
                </span>
                <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-coral-500">
                  RUN
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                Official Marathon Series • New Delhi
              </div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-display font-bold uppercase tracking-wider text-slate-200">
            <a href="#home" className="hover:text-coral-400 transition-colors">
              Home
            </a>
            <a href="#categories" className="hover:text-coral-400 transition-colors">
              Categories
            </a>
            <a href="#race-kit" className="hover:text-coral-400 transition-colors">
              Race Kit &amp; Medal
            </a>
            <a href="#route-map" className="hover:text-coral-400 transition-colors">
              Route Map
            </a>
            <a href="#about" className="hover:text-coral-400 transition-colors">
              Highlights
            </a>
            <a href="#results" className="hover:text-coral-400 transition-colors">
              Results
            </a>
            <a href="#contact" className="hover:text-coral-400 transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleOpenRegister()}
              className="bg-gradient-to-r from-coral-500 to-orange-600 text-white font-display font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Register Now</span>
              <span>→</span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-navy-950 border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-display font-bold uppercase tracking-wider">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Home
              </a>
              <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Categories
              </a>
              <a href="#race-kit" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Medal &amp; Kit
              </a>
              <a href="#route-map" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Route Map
              </a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Highlights
              </a>
              <a href="#results" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Results
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenRegister();
              }}
              className="w-full bg-coral-500 text-white font-display font-black uppercase py-3.5 rounded-xl shadow-glow"
            >
              Register Your Spot
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION — CINEMATIC STADIUM & SUNRISE RUNNERS */}
      <section id="home" className="relative bg-navy-950 text-white overflow-hidden min-h-[88vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {heroBgVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-45 scale-105"
            >
              <source src="/race-reel.mp4" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/assets/hero-runners.jpg"
              alt="Delhi Dwarka Run 2027 Sunrise Marathon Runners"
              className="w-full h-full object-cover object-center opacity-50 scale-105 transition-transform duration-1000"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
          <div className="absolute -bottom-8 left-4 select-none pointer-events-none hidden lg:block">
            <span className="font-display font-black italic text-[140px] leading-none text-outline uppercase tracking-tighter">
              DWARKA 42.2K
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-500/20 border border-coral-500/40 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
                  <span className="text-xs font-display font-extrabold uppercase tracking-wider text-coral-300">
                    7th Edition • Sunday, Feb 21, 2027
                  </span>
                </div>

                <button
                  onClick={() => setHeroBgVideo(!heroBgVideo)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <span>{heroBgVideo ? "📸 Switch to Photo View" : "🎥 Play Live Race Video BG"}</span>
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs sm:text-sm font-display font-black uppercase tracking-[0.25em] text-volt">
                  DDA SPORTS COMPLEX, SECTOR 10 • NEW DELHI
                </div>
                <h1 className="font-display font-black italic text-4xl sm:text-6xl lg:text-[64px] leading-[1.02] tracking-tight uppercase">
                  Conquer the Asphalt:{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-orange-500 to-amber-300 block sm:inline">
                    Delhi Dwarka Run 2027
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Experience New Delhi&apos;s fastest, flattest championship course. Run alongside{" "}
                <strong className="text-white font-bold">12,000+ athletes</strong> on traffic-free
                6-lane boulevards with Mylaps RFID timing, official Pacer Squads, and a roaring
                stadium finish.
              </p>

              {/* Radial-Style Countdown Cards */}
              <div className="pt-1">
                <div className="flex items-center justify-between max-w-lg mb-2.5">
                  <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-coral-500" />
                    Race Flag-Off Countdown
                  </span>
                  <span className="text-[11px] font-mono text-volt font-bold">
                    04:30 AM IST • 21.02.2027
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg">
                  {[
                    { label: "DAYS", value: timeLeft.days, max: 365 },
                    { label: "HOURS", value: timeLeft.hours, max: 24 },
                    { label: "MINUTES", value: timeLeft.minutes, max: 60 },
                    { label: "SECONDS", value: timeLeft.seconds, max: 60 },
                  ].map((item) => {
                    const pct = Math.min(100, Math.round((item.value / item.max) * 100));
                    return (
                      <div
                        key={item.label}
                        className="relative bg-navy-900/85 border border-white/15 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-coral-500/60 transition-all"
                      >
                        <div className="font-athletic font-bold text-4xl sm:text-5xl text-white leading-none tracking-wide tabular-nums">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-display font-extrabold uppercase tracking-widest text-coral-400 mt-1">
                          {item.label}
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full mt-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-coral-500 to-volt h-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenRegister()}
                  className="bg-gradient-to-r from-coral-500 via-orange-500 to-amber-500 hover:from-coral-600 hover:to-orange-600 text-white font-display font-black uppercase tracking-wider text-sm sm:text-base px-8 py-4 rounded-2xl shadow-glow-lg hover:scale-[1.02] transition-all flex items-center gap-3"
                >
                  <span>Register Your Spot</span>
                  <span className="bg-black/25 px-2.5 py-1 rounded-lg text-xs">From ₹799</span>
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-white/25 text-white font-display font-bold text-sm px-6 py-4 rounded-2xl backdrop-blur-md transition-all flex items-center gap-3 group"
                >
                  <span className="w-9 h-9 rounded-xl bg-coral-500 group-hover:scale-110 transition-transform flex items-center justify-center shadow">
                    ▶
                  </span>
                  <div className="text-left">
                    <div className="text-xs font-extrabold uppercase tracking-wider">
                      Watch Race Reel
                    </div>
                    <div className="text-[10px] text-slate-300">Official Dwarka Run Film</div>
                  </div>
                </button>
              </div>

              {/* Social Proof Bar */}
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
                <div className="flex -space-x-2">
                  <span className="w-7 h-7 rounded-full bg-coral-500 border-2 border-navy-950 flex items-center justify-center font-bold text-[10px]">
                    AS
                  </span>
                  <span className="w-7 h-7 rounded-full bg-sky-500 border-2 border-navy-950 flex items-center justify-center font-bold text-[10px]">
                    MK
                  </span>
                  <span className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-navy-950 flex items-center justify-center font-bold text-[10px]">
                    VR
                  </span>
                  <span className="w-7 h-7 rounded-full bg-amber-500 border-2 border-navy-950 flex items-center justify-center font-bold text-[10px]">
                    +9k
                  </span>
                </div>
                <span>
                  <strong className="text-volt">9,420+ Runners</strong> already registered for 2027
                  • Early Bird Phase II closing soon
                </span>
              </div>
            </div>

            {/* Right 5 Cols: Interactive Pro Race Selector Card */}
            <div className="lg:col-span-5">
              <div className="bg-navy-900/85 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-[11px] font-display font-black uppercase tracking-widest text-volt">
                      ⚡ Instant Bib Booking
                    </span>
                    <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
                      Select Your Distance
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                    ● Registrations Open
                  </span>
                </div>

                <div className="space-y-3">
                  {RACE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat)}
                        className={`cursor-pointer rounded-2xl p-3.5 transition-all border ${
                          isSelected
                            ? "bg-white text-navy-950 border-coral-500 shadow-xl scale-[1.01]"
                            : "bg-navy-950/70 text-white border-white/10 hover:border-white/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex flex-col items-center justify-center shadow-md shrink-0`}
                            >
                              <span className="font-athletic font-bold text-2xl leading-none pt-1">
                                {cat.distance.split(" ")[0]}
                              </span>
                              <span className="text-[9px] font-display font-extrabold uppercase tracking-widest">
                                KM
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-display font-extrabold text-sm sm:text-base">
                                  {cat.name}
                                </h3>
                                {cat.popular && (
                                  <span className="px-2 py-0.5 text-[9px] font-display font-black uppercase rounded bg-coral-500 text-white">
                                    HOT
                                  </span>
                                )}
                              </div>
                              <p
                                className={`text-xs ${
                                  isSelected ? "text-slate-600" : "text-slate-300"
                                }`}
                              >
                                Flag-off: {cat.startTime} • {cat.prizePool}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <div
                                  className={`w-24 h-1.5 rounded-full overflow-hidden ${
                                    isSelected ? "bg-slate-200" : "bg-white/15"
                                  }`}
                                >
                                  <div
                                    className="bg-coral-500 h-full rounded-full"
                                    style={{ width: `${cat.slotsFilled}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-[10px] font-bold ${
                                    isSelected ? "text-coral-600" : "text-coral-400"
                                  }`}
                                >
                                  {cat.slotsFilled}% Booked
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs line-through opacity-50">
                              ₹{cat.originalFee}
                            </div>
                            <div
                              className={`font-display font-black text-xl ${
                                isSelected ? "text-coral-600" : "text-volt"
                              }`}
                            >
                              ₹{cat.fee}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleOpenRegister(selectedCategory)}
                  className="mt-5 w-full bg-gradient-to-r from-coral-500 to-orange-600 hover:from-coral-600 hover:to-orange-700 text-white font-display font-black uppercase tracking-wider text-sm py-4 rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <span>
                    Lock {selectedCategory.distance} Spot — ₹{selectedCategory.fee}
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL ACCREDITATIONS & PARTNERS RIBBON */}
      <section className="bg-navy-900 border-y border-white/10 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center text-center">
            {[
              { tag: "COURSE CERTIFICATION", title: "AIMS / IAAF Grade", sub: "Laser Measured Loop" },
              { tag: "TIMING PARTNER", title: "Mylaps BibTag RFID", sub: "Net & Gun Time Splits" },
              { tag: "MEDICAL PARTNER", title: "Max Super Speciality", sub: "6 ACLS Ambulances" },
              { tag: "HYDRATION PARTNER", title: "Fast&Up Isotonic", sub: "Every 2.0 KM Station" },
              { tag: "VENUE PARTNER", title: "DDA Sports Complex", sub: "Sector 10, Dwarka" },
              { tag: "TRANSIT ACCESS", title: "DMRC Blue Line", sub: "300m from Sec-10 Metro" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-3.5 hover:border-coral-500/50 transition-colors"
              >
                <div className="text-[9px] font-display font-extrabold uppercase tracking-widest text-coral-400">
                  {item.tag}
                </div>
                <div className="font-display font-black text-sm text-white mt-0.5">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-400">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RACE CATEGORIES SECTION WITH VISUAL CARDS & PACE CALCULATOR */}
      <section id="categories" className="py-24 bg-slate-50 asphalt-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-coral-500/10 text-coral-600 font-display font-extrabold text-xs uppercase tracking-widest mb-3">
                <span>🏃‍♂️ 4 Championship Distances</span>
              </div>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-950 uppercase tracking-tight">
                Choose Your Race Category
              </h2>
            </div>
            <p className="text-slate-600 max-w-md text-sm sm:text-base">
              Every category features wave-wise corral starts, official finisher medals,
              high-visibility AeroMesh jerseys, and post-race hot breakfast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {RACE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className={`group bg-white rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
                  cat.popular
                    ? "border-coral-500 shadow-2xl ring-4 ring-coral-500/15 lg:-translate-y-3"
                    : "border-slate-200/90 shadow-card hover:shadow-2xl hover:-translate-y-2"
                }`}
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-navy-950">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-55 group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-lg bg-gradient-to-r ${cat.color} text-white text-[10px] font-display font-black uppercase tracking-wider shadow`}
                      >
                        {cat.badge}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                        {cat.minAge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between text-white">
                      <div>
                        <div className="font-athletic font-bold text-5xl leading-none tracking-wide text-white drop-shadow">
                          {cat.distance}
                        </div>
                        <h3 className="font-display font-extrabold text-base text-white">
                          {cat.name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">Slot Capacity</span>
                        <span className="text-coral-600">{cat.slotsFilled}% Filled</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                          style={{ width: `${cat.slotsFilled}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Flag-Off</span>
                        <span className="font-display font-extrabold text-navy-900">
                          {cat.startTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Cut-Off</span>
                        <span className="font-display font-extrabold text-navy-900">
                          {cat.cutoffTime}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Timing</span>
                        <span className="font-display font-extrabold text-navy-900">
                          {cat.timed ? "Mylaps RFID" : "Fun Run"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Hydration</span>
                        <span className="font-display font-extrabold text-navy-900">
                          {cat.hydrationPoints} Aid Points
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-400">
                        Included Runner Entitlements
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                        {cat.perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              ✓
                            </span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-3 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-semibold">
                        Early Bird Entry
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-3xl text-navy-950">
                          ₹{cat.fee}
                        </span>
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          ₹{cat.originalFee}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-display font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-lg">
                      Save ₹{cat.originalFee - cat.fee}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenRegister(cat)}
                    className={`w-full py-4 px-5 rounded-2xl font-display font-black uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 ${
                      cat.popular
                        ? "bg-gradient-to-r from-coral-500 to-orange-600 text-white shadow-glow hover:scale-[1.02]"
                        : "bg-navy-950 hover:bg-coral-500 text-white"
                    }`}
                  >
                    <span>Register {cat.distance}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE PACE & CORRAL CALCULATOR WIDGET */}
          <div className="mt-16 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl border border-white/10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-2">
                <span className="text-xs font-display font-black uppercase tracking-widest text-volt">
                  ⏱️ Interactive Runner Tool
                </span>
                <h3 className="font-display font-black italic text-2xl sm:text-3xl uppercase">
                  Target Pace &amp; Corral Wave Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Plan your race strategy on Dwarka&apos;s flat asphalt. Select your distance and
                  target finish time to calculate your required per-kilometer split and starting
                  corral wave.
                </p>
              </div>

              <div className="lg:col-span-4 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Distance
                  </label>
                  <select
                    value={calcDist}
                    onChange={(e) => setCalcDist(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-white/20 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold text-white"
                  >
                    <option value={5}>5 KM</option>
                    <option value={10}>10 KM</option>
                    <option value={21.0975}>21.1 KM</option>
                    <option value={42.195}>42.2 KM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Hours
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={calcHours}
                    onChange={(e) => setCalcHours(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-white/20 rounded-xl px-3 py-3 text-sm font-bold text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Minutes
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={calcMins}
                    onChange={(e) => setCalcMins(Number(e.target.value))}
                    className="w-full bg-navy-950 border border-white/20 rounded-xl px-3 py-3 text-sm font-bold text-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-3 bg-white/10 border border-white/15 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-display font-bold uppercase text-coral-400">
                    Required Pace
                  </div>
                  <div className="font-athletic font-bold text-4xl text-white leading-none mt-1">
                    {paceResult.pace} <span className="text-base font-sans text-slate-300">/km</span>
                  </div>
                  <div className="text-[11px] text-volt font-semibold mt-1">
                    {paceResult.corral}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Avg Speed</div>
                  <div className="font-display font-black text-lg text-white">
                    {paceResult.speed} km/h
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL 2027 RACE KIT & MEDAL STUDIO SHOWCASE */}
      <section id="race-kit" className="py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-3.5 py-1 rounded-full bg-coral-500/20 text-coral-400 font-display font-black text-xs uppercase tracking-widest mb-3">
              🏅 Official 2027 Runner Gear
            </span>
            <h2 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight">
              Crafted for Champions: Your 2027 Race Kit
            </h2>
            <p className="text-slate-300 mt-3 text-sm sm:text-base">
              Every registered participant receives our pro-grade marathon kit at the Two-Day Bib
              Expo (Feb 19–20, 2027) and a heavyweight 3D Die-Cast Finisher Medal upon crossing the
              gantry.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl group">
                <img
                  src="/assets/race-kit-2027.jpg"
                  alt="Delhi Dwarka Run 2027 Official Finisher Medal, Dry-Fit Jersey and Bib"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-coral-500 text-white font-display font-black text-[10px] uppercase tracking-wider">
                      2027 Collector&apos;s Edition
                    </span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                      AeroMesh Singlet + 85mm Gold/Navy Medal + RFID Bib
                    </h3>
                  </div>
                  <button
                    onClick={() => handleOpenRegister()}
                    className="bg-volt text-navy-950 hover:bg-white font-display font-black text-xs uppercase px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Claim Your Kit →
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              {KIT_HOTSPOTS.map((item) => {
                const isActive = activeHotspot.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveHotspot(item)}
                    className={`cursor-pointer rounded-2xl p-5 transition-all border ${
                      isActive
                        ? "bg-gradient-to-r from-navy-800 to-navy-900 border-coral-500 shadow-glow"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-extrabold text-base sm:text-lg text-white">
                        {item.title}
                      </h4>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive ? "bg-coral-500" : "bg-white/30"
                        }`}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="mt-3 inline-block px-2.5 py-1 rounded-md bg-black/30 text-[11px] font-mono text-volt">
                      {item.spec}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TELEMETRY ROUTE MAP & ELEVATION PROFILE */}
      <section id="route-map" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-navy-900/10 text-navy-900 font-display font-black text-xs uppercase tracking-widest mb-2">
                📍 AIMS-Standard Course Telemetry
              </span>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-950 uppercase tracking-tight">
                Interactive Route &amp; Elevation Map
              </h2>
            </div>

            <div className="inline-flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {(
                [
                  { id: "5k", label: "5K Loop" },
                  { id: "10k", label: "10K Circuit" },
                  { id: "half", label: "21.1K Half" },
                  { id: "full", label: "42.2K Full" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveRouteTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl font-display font-black uppercase text-xs transition-all ${
                    activeRouteTab === tab.id
                      ? "bg-coral-500 text-white shadow-md"
                      : "text-slate-600 hover:text-navy-950"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 bg-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-navy-800 flex flex-col justify-between dark-telemetry-grid">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-volt font-display font-extrabold">
                    GPS Course Map • Dwarka Sub-City
                  </span>
                  <h3 className="font-display font-black text-xl text-white">
                    {ROUTE_DATA[activeRouteTab].title}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral-500" /> Course
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Hydration
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-volt" /> Start/Finish
                  </span>
                </div>
              </div>

              <div className="bg-navy-900/90 rounded-2xl border border-white/10 p-4">
                <svg viewBox="0 0 750 320" className="w-full h-auto">
                  <text x="90" y="38" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="800">
                    SECTOR 6 &amp; 7 BOULEVARD
                  </text>
                  <text x="320" y="38" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="800">
                    BHARAT VANDANA PARK AVE
                  </text>
                  <text x="530" y="38" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="800">
                    GOLF COURSE RD / SEC 21
                  </text>
                  <text x="280" y="305" fill="rgba(255,255,255,0.3)" fontSize="11" fontWeight="800">
                    SECTOR 10, 11 &amp; 12 METRO CORRIDOR
                  </text>

                  <path
                    d={ROUTE_DATA[activeRouteTab].svgPath}
                    fill="none"
                    stroke="rgba(255, 87, 34, 0.25)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  <path
                    d={ROUTE_DATA[activeRouteTab].svgPath}
                    fill="none"
                    stroke="#FF5722"
                    strokeWidth="5"
                    strokeDasharray="12 8"
                    strokeLinecap="round"
                    className="route-animated"
                  />

                  <circle cx="220" cy="95" r="7" fill="#38BDF8" />
                  <text x="195" y="78" fill="#BAE6FD" fontSize="10" fontWeight="700">
                    💧 KM 2.5 Aid
                  </text>

                  <circle cx="480" cy="105" r="7" fill="#38BDF8" />
                  <text x="450" y="88" fill="#BAE6FD" fontSize="10" fontWeight="700">
                    ⚡ Energy + Med
                  </text>

                  <circle cx="380" cy="275" r="7" fill="#38BDF8" />
                  <text x="350" y="293" fill="#BAE6FD" fontSize="10" fontWeight="700">
                    💧 Fast&amp;Up Station
                  </text>

                  <circle cx="80" cy="215" r="12" fill="#CCFF00" />
                  <circle cx="80" cy="215" r="5" fill="#040814" />
                  <rect
                    x="20"
                    y="232"
                    width="155"
                    height="26"
                    rx="6"
                    fill="#040814"
                    stroke="#CCFF00"
                    strokeWidth="1.5"
                  />
                  <text x="30" y="249" fill="#CCFF00" fontSize="10" fontWeight="800">
                    🏁 SEC-10 START / FINISH
                  </text>
                </svg>
              </div>

              <div className="mt-4 bg-navy-900/80 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-display font-bold uppercase text-slate-400">
                    Elevation Profile (212m – 224m ASL)
                  </span>
                  <span className="font-mono font-bold text-volt">
                    {ROUTE_DATA[activeRouteTab].elevationGain}
                  </span>
                </div>
                <svg viewBox="0 0 600 90" className="w-full h-14">
                  <polyline
                    fill="none"
                    stroke="#FF5722"
                    strokeWidth="3"
                    points={ROUTE_DATA[activeRouteTab].elevationPoints}
                  />
                </svg>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5">
                <div>
                  <span className="text-xs font-display font-black uppercase text-coral-600">
                    Course Turn-by-Turn
                  </span>
                  <h3 className="font-display font-extrabold text-xl text-navy-950 mt-1">
                    {ROUTE_DATA[activeRouteTab].title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {ROUTE_DATA[activeRouteTab].pathDesc}
                  </p>
                </div>

                <div>
                  <div className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                    Race Morning Timeline (Sun, Feb 21, 2027)
                  </div>
                  <div className="space-y-2">
                    {RACE_DAY_SCHEDULE.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-xl border border-slate-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-coral-600">{s.time}</span>
                          <span className="font-semibold text-navy-950">{s.event}</span>
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded hidden sm:inline">
                          {s.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINISH LINE FESTIVAL & VIDEO HIGHLIGHTS BENTO SECTION */}
      <section id="about" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-volt font-display font-black text-xs uppercase tracking-widest">
                🎬 Race Atmosphere &amp; Highlights
              </span>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight mt-1">
                More Than a Race — It&apos;s a Festival
              </h2>
            </div>
            <p className="text-slate-300 text-sm max-w-md">
              From Punjabi Dhol troops along Sector 10 &amp; 11 to confetti cannons at the finish
              gantry, watch how Dwarka celebrates every single finisher.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-navy-950 rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between">
              <div className="px-6 py-4 bg-navy-900 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-coral-500 animate-pulse" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">
                    Official Race Aftermovie — Delhi Dwarka Marathon
                  </span>
                </div>
                <span className="text-[11px] font-mono text-volt">1080p HD</span>
              </div>
              <video
                controls
                preload="metadata"
                poster="/assets/finish-line.jpg"
                className="w-full aspect-video object-cover bg-black"
              >
                <source src="/race-reel.mp4" type="video/mp4" />
              </video>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 flex-1 min-h-[240px] group">
                <img
                  src="/assets/finish-line.jpg"
                  alt="Finish Line Gantry Celebration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="px-2.5 py-1 rounded bg-coral-500 text-white text-[10px] font-display font-black uppercase">
                    Finish Line Carnival
                  </span>
                  <h3 className="font-display font-black text-xl text-white mt-1">
                    Roaring Crowds, Live DJ, Medal Engraving &amp; Recovery Zone
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-athletic font-bold text-4xl text-volt">28+</div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    Official Pacer Buses
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-athletic font-bold text-4xl text-coral-400">15</div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    Cheering &amp; Dhol Zones
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-athletic font-bold text-4xl text-white">100%</div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    Free AI Race Photos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS LEADERBOARD & FAQ SECTION */}
      <section id="results" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-coral-500/10 text-coral-600 font-display font-black text-xs uppercase tracking-widest mb-2">
                  🏆 Hall of Fame &amp; Live 2027 Roster
                </span>
                <h2 className="font-display font-black italic text-3xl sm:text-4xl text-navy-950 uppercase">
                  Official Results &amp; Confirmed Bibs
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={resultsQuery}
                  onChange={(e) => setResultsQuery(e.target.value)}
                  placeholder="Search by Bib # or Runner Name..."
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm min-w-[240px]"
                />
                <select
                  value={resultsCategoryFilter}
                  onChange={(e) => setResultsCategoryFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                >
                  <option value="All">All Categories</option>
                  {RACE_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-card">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-950 text-white text-xs uppercase tracking-wider font-display">
                    <th className="py-4 px-5">Bib #</th>
                    <th className="py-4 px-5">Runner Name</th>
                    <th className="py-4 px-5">Category</th>
                    <th className="py-4 px-5">Gender</th>
                    <th className="py-4 px-5">Net Time / Status</th>
                    <th className="py-4 px-5">Pace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm bg-white">
                  {filteredResults.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-coral-600">#{row.bib}</td>
                      <td className="py-4 px-5 font-bold text-navy-950">
                        {row.name}
                        {row.isNew && (
                          <span className="ml-2 px-2 py-0.5 text-[10px] font-display font-black uppercase rounded bg-emerald-100 text-emerald-700">
                            2027 Confirmed
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-700">{row.category}</td>
                      <td className="py-4 px-5 text-slate-500">{row.gender}</td>
                      <td className="py-4 px-5 font-mono font-bold text-navy-950">{row.netTime}</td>
                      <td className="py-4 px-5 font-mono text-slate-500">{row.pace}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-display font-black uppercase tracking-widest text-coral-600">
                Runner Information Desk
              </span>
              <h3 className="font-display font-black italic text-3xl text-navy-950 uppercase mt-1">
                Frequently Asked Questions
              </h3>
            </div>
            <div className="space-y-3">
              {FAQS.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between font-display font-bold text-navy-950 text-sm sm:text-base"
                  >
                    <span>{item.q}</span>
                    <span className="text-coral-500 font-black text-lg">
                      {openFaq === idx ? "−" : "+"}
                    </span>
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-white">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT & GROUP ENTRIES SECTION */}
      <section id="contact" className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-coral-500/10 text-coral-600 font-display font-black text-xs uppercase tracking-widest">
                Corporate &amp; Club Desk
              </span>
              <h2 className="font-display font-black italic text-3xl text-navy-950 uppercase">
                Get in Touch With the Race Secretariat
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Planning a corporate team run, RWA group entry (15+ runners), or sponsorship
                activation at the Dwarka Sector 10 Finish Arena? Reach out to our organizing team.
              </p>
              <div className="space-y-3 text-sm pt-2">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="font-display font-bold text-navy-950">
                    📍 Venue &amp; Expo Complex
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    DDA Sports Complex, Sector 10, Dwarka, New Delhi – 110075
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="font-display font-bold text-navy-950">
                    ✉️ Official Support &amp; Bulk Entries
                  </div>
                  <div className="text-coral-600 font-semibold text-xs mt-0.5">
                    support@delhidwarkarun.in • groups@delhidwarkarun.in
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
                <h3 className="font-display font-extrabold text-xl text-navy-950 mb-4">
                  Send Inquiry
                </h3>
                {contactSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="text-3xl">✅</div>
                    <div className="font-display font-bold text-emerald-900">Message Received!</div>
                    <p className="text-xs text-emerald-700">
                      Our Race Secretariat team will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        required
                        type="text"
                        placeholder="Your Full Name *"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                      />
                      <input
                        required
                        type="email"
                        placeholder="Email Address *"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        required
                        type="tel"
                        placeholder="Mobile Number *"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                      />
                      <select className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white">
                        <option>Individual Runner Query</option>
                        <option>Running Club / Corporate Bulk Entry (15+)</option>
                        <option>Pacemaker Application</option>
                        <option>Sponsorship &amp; Expo Stall</option>
                      </select>
                    </div>
                    <textarea
                      required
                      rows={3}
                      placeholder="Your Message *"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-navy-950 hover:bg-coral-500 text-white font-display font-black uppercase tracking-wider text-xs px-7 py-4 rounded-xl transition-colors"
                    >
                      Send Message →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-950 text-slate-400 py-14 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-coral-500 text-white font-athletic font-bold text-xl flex items-center justify-center pt-0.5">
              DDR
            </div>
            <div>
              <div className="font-display font-black text-white text-sm uppercase">
                DELHI DWARKA RUN 2027
              </div>
              <div>Official Marathon Portal • support@delhidwarkarun.in</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-5 font-semibold text-slate-300">
            <a href="#home" className="hover:text-coral-400">
              Home
            </a>
            <a href="#categories" className="hover:text-coral-400">
              Categories
            </a>
            <a href="#race-kit" className="hover:text-coral-400">
              Medal &amp; Kit
            </a>
            <a href="#route-map" className="hover:text-coral-400">
              Route Map
            </a>
            <a href="#results" className="hover:text-coral-400">
              Results
            </a>
          </div>
          <div>© 2026–2027 Delhi Dwarka Run Secretariat. All rights reserved.</div>
        </div>
      </footer>

      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-950 border border-white/20 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h3 className="font-display font-bold text-white text-sm uppercase tracking-wider">
                Delhi Dwarka Run — Official Race Highlight Reel
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>
            <video controls autoPlay className="w-full aspect-video bg-black">
              <source src="/race-reel.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      {isModalOpen && (
        <RegistrationModal
          initialCategory={selectedCategory}
          onClose={() => setIsModalOpen(false)}
          onSuccessRegister={(entry) => setRegistrations((prev) => [entry, ...prev])}
        />
      )}
    </div>
  );
}
