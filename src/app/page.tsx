"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  RACE_CATEGORIES,
  RACE_DATE_ISO,
  ROUTE_DATA,
  INITIAL_RESULTS,
  START_VENUE,
  RaceCategory,
  RunnerResult,
} from "../data/raceData";
import RegistrationModal from "../components/RegistrationModal";
import { ABOUT_EVENT_CONTENT, DISCLAIMER_TEXT } from "../data/legalData";

const KIT_HOTSPOTS = [
  {
    id: "jersey",
    title: "130 GSM AeroMesh DDR Race Jersey",
    desc: "Laser-perforated sweat-wicking fabric in signature Deep Navy with Neon Coral speed stripes and official Delhi Dwarka Runners branding.",
    spec: "UV-40+ Protection • Anti-Chafe Flatlock Seams",
  },
  {
    id: "medal",
    title: "3D Zinc-Alloy Finisher Medal (4th Edition)",
    desc: "Heavyweight antique gold & navy enamel medallion for all finishers across 21.097 KM, 10.5 KM, 5 KM, and 3 KM categories.",
    spec: "All Finishers • Free Time Engraving at Finish Tent",
  },
  {
    id: "bib",
    title: "Official RFID Timing Bib & Lucky Draw Coupon",
    desc: "Tear-proof, sweat-resistant race bib with RFID timing transponder and tear-off stub for the Race Day Lucky Draw.",
    spec: "🎉 Win Exciting Prizes in the Official Lucky Draw!",
  },
  {
    id: "hydration",
    title: "Max Healthcare Support & Post-Run Breakfast",
    desc: "Full medical coverage by Health Partner Max Hospital Sector 10, hydration stations along the route, and hot post-run breakfast.",
    spec: "Starting Point: Max Hospital, Sector 10, Dwarka",
  },
];

const RACE_DAY_SCHEDULE = [
  { time: "04:45 AM", event: "Assembly, Baggage Counter & Warm-Up at Max Hospital Sec-10", tag: "Start Arena" },
  { time: "05:30 AM", event: "21.097 KM Half Marathon Flag-Off", tag: "Flagship Run" },
  { time: "06:00 AM", event: "10.5 KM Challenge Flag-Off", tag: "Timed Run" },
  { time: "06:30 AM", event: "5 KM Run Flag-Off", tag: "Fitness Run" },
  { time: "06:45 AM", event: "3 KM Fun Run / Walk Flag-Off", tag: "Family & Kids" },
  { time: "07:30 AM", event: "Podium Ceremony, Lucky Draw & Live Dhol Festival", tag: "Main Stage" },
];

const FAQS = [
  {
    q: "What is the Starting & Finishing Point for the race?",
    a: "The race starts and finishes at Max Hospital, Sector 10, Dwarka, New Delhi. Ample parking, baggage counters, and medical stations are located right at the starting arena.",
  },
  {
    q: "How does the 50% Discount till 30-Nov-2026 work?",
    a: "All 4 categories currently have a flat 50% early-bird discount automatically applied till 30th November 2026 (Code: DDR50): Half Marathon (21.097 KM) is ₹1,100 (Reg. ₹2,200), 10.5 KM is ₹1,000 (Reg. ₹2,000), 5 KM is ₹900 (Reg. ₹1,800), and 3 KM is ₹800 (Reg. ₹1,600).",
  },
  {
    q: "How do I participate in the Lucky Draw?",
    a: "Every registered runner across 21.097 KM, 10.5 KM, 5 KM, and 3 KM is automatically entered into the Race Day Lucky Draw by Bib Number to win exciting prizes and hampers!",
  },
  {
    q: "Where and when is the Bib & Race Kit Expo?",
    a: "The Bib & T-Shirt Distribution Expo will be held on Friday, 12th Feb & Saturday, 13th Feb 2027 (10:00 AM to 06:00 PM) in Sector 10, Dwarka, New Delhi.",
  },
];

export default function DelhiDwarkaRunPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroBgVideo, setHeroBgVideo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RaceCategory>(
    RACE_CATEGORIES[0] // Default 21.097 KM Half Marathon
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
  const [calcDist, setCalcDist] = useState(21.097);
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

  // Load saved registrations from backend database on mount
  useEffect(() => {
    fetch("/api/registrations?mode=public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.registrations)) {
          setRegistrations(data.registrations);
        }
      })
      .catch(() => {});
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
      {/* HIGH-ENERGY TICKER MARQUEE — MATCHING DDR LOGO PALETTE */}
      <div className="bg-gradient-to-r from-[#0284C7] via-coral-500 to-[#F26522] text-white py-2 overflow-hidden border-b border-[#C5D887]/30">
        <div className="animate-marquee flex items-center gap-10 text-xs font-display font-extrabold uppercase tracking-wider">
          {[1, 2].map((loop) => (
            <React.Fragment key={loop}>
              <span className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-navy-950 text-volt rounded text-[10px]">
                  50% OFF
                </span>
                50% DISCOUNT VALID TILL 30-NOV-2026 (CODE: DDR50)
              </span>
              <span>📅 EVENT DATE: 14-Feb-2027</span>
              <span>📍 STARTING POINT: MAX HOSPITAL, SECTOR 10, DWARKA, NEW DELHI</span>
              <span>🏃‍♂️ 21.097 KM @ ₹1100 • 10.5 KM @ ₹1000 • 5 KM @ ₹900 • 3 KM @ ₹800</span>
              <span>📞 CONTACT: +91 99712 99631 • padam@amigoconnect.com</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STICKY PRO ATHLETIC NAVBAR WITH OFFICIAL DDR LOGO */}
      <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-xl border-b-2 border-[#29ABE2]/30 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3.5 group">
            <div className="h-14 px-2.5 rounded-2xl bg-[#C5D887] flex items-center justify-center shadow-glow border-2 border-[#F26522] group-hover:scale-105 transition-transform relative overflow-hidden shrink-0">
              <img
                src="/assets/ddr-logo.png"
                alt="Delhi Dwarka Runners (DDR) Official Logo"
                className="h-11 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-[#29ABE2]">
                  DELHI DWARKA
                </span>
                <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-coral-500">
                  RUNNERS
                </span>
                <span className="hidden sm:inline-block ml-1 px-2 py-0.5 rounded bg-[#C5D887] text-navy-950 font-display font-black text-[10px] uppercase">
                  2027
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#C5D887]">
                4th Edition Dwarka Half Marathon • 14-Feb-2027
              </div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-display font-bold uppercase tracking-wider text-slate-200">
            <a href="#home" className="hover:text-[#29ABE2] transition-colors">
              Home
            </a>
            <a href="#categories" className="hover:text-coral-400 transition-colors">
              Categories (50% Off)
            </a>
            <a href="#race-kit" className="hover:text-[#C5D887] transition-colors">
              Race Kit
            </a>
            <a href="#route-map" className="hover:text-[#29ABE2] transition-colors">
              Route Map
            </a>
            <a href="#about" className="hover:text-coral-400 transition-colors">
              Highlights
            </a>
            <a href="#results" className="hover:text-[#C5D887] transition-colors">
              Results
            </a>
            <a href="#contact" className="hover:text-[#29ABE2] transition-colors">
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleOpenRegister()}
              className="bg-gradient-to-r from-coral-500 via-[#F26522] to-[#29ABE2] text-white font-display font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Register @ 50% Off</span>
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
                Race Kit
              </a>
              <a href="#route-map" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Route Map
              </a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Highlights
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-white/5">
                Contact
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenRegister();
              }}
              className="w-full bg-coral-500 text-white font-display font-black uppercase py-3.5 rounded-xl shadow-glow"
            >
              Register Now (50% OFF)
            </button>
          </div>
        )}
      </header>

      {/* HERO SECTION — STYLED AFTER DDR POLYGON LOGO & MARATHON THEME */}
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
              alt="Delhi Dwarka Run 2027 — 4th Edition Dwarka Half Marathon"
              className="w-full h-full object-cover object-center opacity-50 scale-105 transition-transform duration-1000"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-[#0284C7]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" />
          <div className="absolute -bottom-8 left-4 select-none pointer-events-none hidden lg:block">
            <span className="font-display font-black italic text-[130px] leading-none text-outline uppercase tracking-tighter">
              21.097 KM • DDR 4TH
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Official DDR Logo Crest + Partner & Event Date Pills */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-[#C5D887]/20 border border-[#C5D887]/60 backdrop-blur-md">
                  <img
                    src="/assets/ddr-logo.png"
                    alt="DDR Logo"
                    className="w-7 h-7 rounded-lg object-contain bg-[#C5D887] p-0.5"
                  />
                  <span className="text-xs font-display font-black uppercase tracking-wider text-[#C5D887]">
                    DELHI DWARKA RUNNERS
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-500/20 border border-coral-500/50 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
                  <span className="text-xs font-display font-extrabold uppercase tracking-wider text-volt">
                    EVENT DATE: 14-Feb-2027
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#29ABE2]/20 border border-[#29ABE2]/50 backdrop-blur-md text-xs font-display font-bold text-[#7DD3FC]">
                  🏥 Health Partner: MAX Healthcare
                </div>

                <button
                  onClick={() => setHeroBgVideo(!heroBgVideo)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-md transition-all"
                >
                  <span>{heroBgVideo ? "📸 Switch to Photo View" : "🎥 Play Live Race Video BG"}</span>
                </button>
              </div>

              <div className="space-y-2.5">
                <div className="text-xs sm:text-sm font-display font-black uppercase tracking-[0.2em] text-[#C5D887]">
                  📍 STARTING POINT: MAX HOSPITAL, SECTOR 10, DWARKA, NEW DELHI
                </div>
                <h1 className="font-display font-black italic text-4xl sm:text-5xl lg:text-[58px] leading-[1.04] tracking-tight uppercase">
                  4th Edition of Dwarka Half Marathon:{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29ABE2] via-coral-500 to-[#C5D887] block sm:inline">
                    Delhi Dwarka Run 2027
                  </span>
                </h1>
              </div>

              {/* Sage-Lime & Cyan-Blue Logo Styled Quote Banner */}
              <div className="inline-block bg-navy-900/90 border-2 border-[#C5D887]/80 rounded-2xl px-5 py-3 shadow-lg">
                <p className="font-display font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#C5D887]">
                  ★ Be a Part of the Biggest Running Event of Dwarka. Create Lifetime Memories. ★
                </p>
              </div>

              {/* Dual Promo Badges: 50% Discount + Lucky Draw */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                <div className="bg-gradient-to-br from-[#0369A1]/90 to-navy-900 border-2 border-[#29ABE2] rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-[#C5D887] text-navy-950 font-athletic font-bold text-3xl flex flex-col items-center justify-center leading-none shrink-0">
                    <span>50%</span>
                    <span className="text-[10px] font-display font-black">OFF</span>
                  </div>
                  <div>
                    <div className="font-display font-black text-sm uppercase text-[#C5D887]">
                      50% Discount Till 30-Nov-2026!
                    </div>
                    <div className="text-xs text-slate-200 mt-0.5">
                      Auto-applied at checkout • Code: <strong className="text-white">DDR50</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-coral-600/90 to-navy-900 border-2 border-[#C5D887] rounded-2xl p-4 flex items-center gap-3.5 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-white/95 p-1 flex items-center justify-center shrink-0">
                    <img
                      src="/assets/ddr-logo.png"
                      alt="DDR Logo"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <div className="font-display font-black text-sm uppercase text-[#C5D887]">
                      🎉 Lucky Draw Included!
                    </div>
                    <div className="text-xs text-slate-100 mt-0.5">
                      Win Exciting Prizes &amp; Many More on Race Day!
                    </div>
                  </div>
                </div>
              </div>

              {/* Radial-Style Countdown Cards to 14-Feb-2027 */}
              <div className="pt-1">
                <div className="flex items-center justify-between max-w-lg mb-2.5">
                  <span className="text-[11px] font-display font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-coral-500" />
                    Countdown to Flag-Off (14-Feb-2027 • 05:30 AM)
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg">
                  {[
                    { label: "DAYS", value: timeLeft.days, max: 150 },
                    { label: "HOURS", value: timeLeft.hours, max: 24 },
                    { label: "MINUTES", value: timeLeft.minutes, max: 60 },
                    { label: "SECONDS", value: timeLeft.seconds, max: 60 },
                  ].map((item) => {
                    const pct = Math.min(100, Math.round((item.value / item.max) * 100));
                    return (
                      <div
                        key={item.label}
                        className="relative bg-navy-900/85 border border-[#29ABE2]/35 rounded-2xl p-3 sm:p-4 text-center backdrop-blur-xl shadow-2xl overflow-hidden"
                      >
                        <div className="font-athletic font-bold text-4xl sm:text-5xl text-white leading-none tracking-wide tabular-nums">
                          {String(item.value).padStart(2, "0")}
                        </div>
                        <div className="text-[10px] sm:text-[11px] font-display font-extrabold uppercase tracking-widest text-[#29ABE2] mt-1">
                          {item.label}
                        </div>
                        <div className="w-full bg-white/10 h-1 rounded-full mt-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#29ABE2] via-coral-500 to-[#C5D887] h-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => handleOpenRegister()}
                  className="bg-gradient-to-r from-coral-500 via-[#F26522] to-[#29ABE2] hover:from-coral-600 hover:to-[#0284C7] text-white font-display font-black uppercase tracking-wider text-sm sm:text-base px-8 py-4 rounded-2xl shadow-glow-lg hover:scale-[1.02] transition-all flex items-center gap-3"
                >
                  <span>Register Your Spot (50% OFF)</span>
                  <span className="bg-black/25 px-2.5 py-1 rounded-lg text-xs">From ₹800</span>
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border border-[#29ABE2]/40 text-white font-display font-bold text-sm px-6 py-4 rounded-2xl backdrop-blur-md transition-all flex items-center gap-3 group"
                >
                  <span className="w-9 h-9 rounded-xl bg-[#29ABE2] group-hover:scale-110 transition-transform flex items-center justify-center shadow">
                    ▶
                  </span>
                  <div className="text-left">
                    <div className="text-xs font-extrabold uppercase tracking-wider">
                      Watch Official Reel
                    </div>
                    <div className="text-[10px] text-slate-300">DDR Half Marathon Video</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Right 5 Cols: Category Pricing Stack Matching DDR Logo Theme */}
            <div className="lg:col-span-5">
              <div className="bg-navy-900/90 backdrop-blur-2xl border-2 border-[#29ABE2]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <span className="text-[11px] font-display font-black uppercase tracking-widest text-[#C5D887]">
                      ⚡ 50% OFF TILL 30-NOV-2026
                    </span>
                    <h2 className="font-display font-black text-xl text-white uppercase tracking-tight">
                      Choose Your Race Category
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#29ABE2]/20 border border-[#29ABE2]/50 text-[#7DD3FC] text-[11px] font-bold">
                    14-Feb-2027
                  </span>
                </div>

                <div className="space-y-3">
                  {RACE_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory.id === cat.id;
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat)}
                        className={`cursor-pointer rounded-2xl p-4 transition-all border-2 ${
                          isSelected
                            ? "bg-navy-950 text-white border-[#C5D887] shadow-xl scale-[1.01]"
                            : "bg-navy-950/75 text-white border-white/10 hover:border-[#29ABE2]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-athletic font-bold text-3xl sm:text-4xl text-white leading-none">
                                {cat.distance}
                              </span>
                              <span className="px-2 py-0.5 text-[9px] font-display font-black uppercase rounded bg-coral-500 text-white">
                                50% OFF
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {cat.name} • Start: {cat.startTime}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs sm:text-sm font-display font-bold text-slate-400 line-through">
                              RS. {cat.originalFee}
                            </div>
                            <div className="font-display font-black text-xl sm:text-2xl text-[#C5D887]">
                              RS. {cat.fee}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => handleOpenRegister(selectedCategory)}
                  className="mt-5 w-full bg-gradient-to-r from-coral-500 via-[#F26522] to-[#29ABE2] hover:from-coral-600 hover:to-[#0284C7] text-white font-display font-black uppercase tracking-wider text-sm py-4 rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
                >
                  <span>
                    Register {selectedCategory.distance} @ RS. {selectedCategory.fee}
                  </span>
                  <span>→</span>
                </button>

                <p className="text-center text-[11px] text-slate-300 mt-3">
                  📍 Starting Point: <strong className="text-white">{START_VENUE}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL ACCREDITATIONS & PARTNERS RIBBON */}
      <section className="bg-navy-900 border-y border-[#29ABE2]/25 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center text-center">
            {[
              { tag: "ORGANIZER", title: "DDR (4th Edition)", sub: "Delhi Dwarka Runners" },
              { tag: "HEALTH PARTNER", title: "MAX Healthcare", sub: "Max Hospital Sec-10" },
              { tag: "STARTING POINT", title: "Max Hospital, Sec-10", sub: "Dwarka, New Delhi" },
              { tag: "EVENT DATE", title: "14-Feb-2027", sub: "Sunday Morning Flag-Off" },
              { tag: "EARLY BIRD OFFER", title: "Flat 50% Discount", sub: "Valid till 30-Nov-2026" },
              { tag: "OFFICIAL HELPDESK", title: "+91 99712 99631", sub: "padam@amigoconnect.com" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-2xl p-3.5 hover:border-[#29ABE2]/60 transition-colors"
              >
                <div className="text-[9px] font-display font-extrabold uppercase tracking-widest text-[#29ABE2]">
                  {item.tag}
                </div>
                <div className="font-display font-black text-sm text-white mt-0.5">
                  {item.title}
                </div>
                <div className="text-[11px] text-[#C5D887]">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RACE CATEGORIES SECTION WITH 50% DISCOUNT CARDS */}
      <section id="categories" className="py-24 bg-slate-50 asphalt-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-display font-extrabold text-xs uppercase tracking-widest mb-3">
                <span>🔥 Flat 50% Discount Applicable Till 30-Nov-2026</span>
              </div>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-950 uppercase tracking-tight">
                4 Race Categories — 14-Feb-2027
              </h2>
            </div>
            <p className="text-slate-600 max-w-md text-sm sm:text-base">
              Starting from <strong>Max Hospital, Sector 10, Dwarka, New Delhi</strong>. Every
              participant receives a Finisher Medal, Race T-Shirt, Bib, Breakfast, and Lucky Draw
              entry!
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
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-volt text-[11px] font-bold">
                        50% OFF
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
                        <span className="text-slate-500">Early Bird Slots</span>
                        <span className="text-coral-600">{cat.slotsFilled}% Booked</span>
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
                        <span className="text-slate-400 block text-[11px]">Start Venue</span>
                        <span className="font-display font-extrabold text-navy-900">
                          Max Hospital Sec-10
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
                      <span className="text-[11px] text-emerald-700 block font-bold">
                        50% OFF Till 30-Nov-2026
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-display font-black text-3xl text-emerald-600">
                          ₹{cat.fee}
                        </span>
                        <span className="text-sm text-slate-400 line-through font-bold">
                          ₹{cat.originalFee}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-display font-black uppercase tracking-wider text-white bg-emerald-600 px-2.5 py-1 rounded-lg">
                      SAVE ₹{cat.originalFee - cat.fee}
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
                    <span>
                      Register {cat.distance} @ ₹{cat.fee}
                    </span>
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
                  Target Pace &amp; Corral Calculator
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Plan your race strategy across our 21.097 KM, 10.5 KM, 5 KM, or 3 KM distances.
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
                    <option value={21.097}>21.097 KM</option>
                    <option value={10.5}>10.5 KM</option>
                    <option value={5}>5 KM</option>
                    <option value={3}>3 KM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Hours
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={4}
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
              🏅 4th Edition Official Runner Gear
            </span>
            <h2 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight">
              Crafted for Champions: Your Finisher Kit
            </h2>
            <p className="text-slate-300 mt-3 text-sm sm:text-base">
              Organized by <strong>Delhi Dwarka Runners (DDR)</strong> with Health Partner{" "}
              <strong>Max Healthcare</strong>. Starting from{" "}
              <strong>Max Hospital, Sector 10, Dwarka, New Delhi</strong> on{" "}
              <strong>14-Feb-2027</strong>.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 Cols: Race Kit Studio Photo */}
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
                      Included With Every Entry
                    </span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-white mt-1">
                      DDR Dry-Fit Tee + 3D Medal + RFID Bib + Lucky Draw
                    </h3>
                  </div>
                  <button
                    onClick={() => handleOpenRegister()}
                    className="bg-volt text-navy-950 hover:bg-white font-display font-black text-xs uppercase px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Book @ 50% Off →
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Gear Breakdown */}
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
                      <h4 className="font-display font-extrabold text-base text-white">
                        {item.title}
                      </h4>
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isActive ? "bg-coral-500" : "bg-white/30"
                        }`}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="mt-2.5 inline-block px-2.5 py-1 rounded bg-black/30 text-[11px] font-mono text-volt">
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
                📍 Starting Point: {START_VENUE}
              </span>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-950 uppercase tracking-tight">
                Interactive Route &amp; Elevation Map
              </h2>
            </div>

            <div className="inline-flex flex-wrap gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {(
                [
                  { id: "half", label: "21.097 KM Half" },
                  { id: "10.5k", label: "10.5 KM Run" },
                  { id: "5k", label: "5 KM Run" },
                  { id: "3k", label: "3 KM Fun Run" },
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
                    GPS Course Map • Start/Finish: Max Hospital Sector 10
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
                    <span className="w-2.5 h-2.5 rounded-full bg-volt" /> Max Hospital Sec-10
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
                    SECTOR 10 &amp; 11 METRO CORRIDOR
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
                    💧 Hydration 1
                  </text>

                  <circle cx="480" cy="105" r="7" fill="#38BDF8" />
                  <text x="440" y="88" fill="#BAE6FD" fontSize="10" fontWeight="700">
                    🏥 Max Medical &amp; Aid
                  </text>

                  <circle cx="380" cy="275" r="7" fill="#38BDF8" />
                  <text x="350" y="293" fill="#BAE6FD" fontSize="10" fontWeight="700">
                    💧 Hydration &amp; Energy
                  </text>

                  <circle cx="80" cy="215" r="12" fill="#CCFF00" />
                  <circle cx="80" cy="215" r="5" fill="#040814" />
                  <rect
                    x="15"
                    y="232"
                    width="185"
                    height="26"
                    rx="6"
                    fill="#040814"
                    stroke="#CCFF00"
                    strokeWidth="1.5"
                  />
                  <text x="24" y="249" fill="#CCFF00" fontSize="10" fontWeight="800">
                    🏁 MAX HOSPITAL SEC-10 START
                  </text>
                </svg>
              </div>

              <div className="mt-4 bg-navy-900/80 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-display font-bold uppercase text-slate-400">
                    Elevation Profile (Flat Dwarka Asphalt)
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
                    Race Morning Timeline (Sun, 14th Feb 2027)
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
                🎬 4th Edition Race Atmosphere &amp; Highlights
              </span>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight mt-1">
                Be a Part of the Biggest Running Event of Dwarka
              </h2>
            </div>
            <p className="text-slate-300 text-sm max-w-md">
              Create lifetime memories with thousands of runners, live Dhol beats, Lucky Draw
              prizes, and Max Healthcare wellness zones at Max Hospital, Sector 10, Dwarka.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-navy-950 rounded-3xl overflow-hidden border border-white/15 shadow-2xl flex flex-col justify-between">
              <div className="px-6 py-4 bg-navy-900 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-coral-500 animate-pulse" />
                  <span className="font-display font-bold text-xs uppercase tracking-wider">
                    Official Highlight Reel — DDR Dwarka Half Marathon
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
                    🎉 Lucky Draw &amp; Finish Carnival
                  </span>
                  <h3 className="font-display font-black text-xl text-white mt-1">
                    Win Exciting Prizes, Trophies &amp; Finisher Medals on 14th Feb 2027
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-athletic font-bold text-4xl text-volt">50% OFF</div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    Valid Till 30-Nov-2026
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-athletic font-bold text-4xl text-coral-400">4th</div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    Championship Edition
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="font-athletic font-bold text-4xl text-white">14 FEB</div>
                  <div className="text-[11px] text-slate-300 font-semibold">
                    2027 Race Date
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT EVENT DETAILS: WHY PARTICIPATE, WHO SHOULD JOIN & EXPERIENCE */}
          <div className="mt-14 grid lg:grid-cols-3 gap-6">
            <div className="bg-navy-950/90 border border-white/15 rounded-3xl p-6 sm:p-7 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-coral-500/20 text-coral-400 font-display font-black text-xs uppercase tracking-wider">
                About The Event
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase">
                The DDR Marathon Experience
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {ABOUT_EVENT_CONTENT.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {ABOUT_EVENT_CONTENT.experience.map((p, i) => (
                  <p key={`exp-${i}`} className="text-slate-200 font-medium">
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-navy-950/90 border border-white/15 rounded-3xl p-6 sm:p-7 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#29ABE2]/20 text-[#29ABE2] font-display font-black text-xs uppercase tracking-wider">
                Why Participate
              </span>
              <h3 className="font-display font-black text-xl text-white uppercase">
                Why Run in Delhi Dwarka Run (DDR)
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                {ABOUT_EVENT_CONTENT.whyParticipate.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#C5D887] text-navy-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy-950/90 border border-white/15 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#C5D887]/20 text-[#C5D887] font-display font-black text-xs uppercase tracking-wider">
                  Who Should Join
                </span>
                <h3 className="font-display font-black text-xl text-white uppercase">
                  Designed For Every Runner
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {ABOUT_EVENT_CONTENT.whoShouldJoin.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-coral-400 font-bold">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-white/10">
                <div className="text-xs font-display font-bold text-[#C5D887] uppercase mb-2">
                  Register Now — 50% Early Bird Offer LIVE
                </div>
                <button
                  onClick={() => handleOpenRegister()}
                  className="w-full bg-gradient-to-r from-coral-500 to-[#29ABE2] text-white font-display font-black uppercase text-xs py-3.5 rounded-xl shadow-glow"
                >
                  Secure Your Spot Today →
                </button>
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
                    <th className="py-4 px-5">Pace / Perks</th>
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
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#29ABE2]/15 text-[#0284C7] font-display font-black text-xs uppercase tracking-widest">
                <img
                  src="/assets/ddr-logo.png"
                  alt="DDR Logo"
                  className="w-6 h-6 rounded object-contain"
                />
                <span>Delhi Dwarka Runners (DDR) Helpdesk</span>
              </div>
              <h2 className="font-display font-black italic text-3xl text-navy-950 uppercase">
                Get in Touch With the Organizing Team
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Planning a corporate group entry, RWA bulk registration, or sponsorship at the 4th
                Edition of Dwarka Half Marathon? Reach out directly to our organizing team.
              </p>
              <div className="space-y-3 text-sm pt-2">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="font-display font-bold text-navy-950">
                    📍 Starting &amp; Finishing Point
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">
                    Max Hospital, Sector 10, Dwarka, New Delhi – 110075
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="font-display font-bold text-navy-950">
                    ✉️ Official Contact Email ID
                  </div>
                  <a
                    href="mailto:padam@amigoconnect.com"
                    className="text-coral-600 hover:text-[#0284C7] font-bold text-sm mt-0.5 inline-block underline"
                  >
                    padam@amigoconnect.com
                  </a>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="font-display font-bold text-navy-950">
                    📞 Official Helpline / WhatsApp Mobile
                  </div>
                  <a
                    href="tel:+919971299631"
                    className="text-[#0284C7] hover:text-coral-600 font-bold text-sm mt-0.5 inline-block"
                  >
                    +91 99712 99631
                  </a>
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
                      Our Delhi Dwarka Runners team (padam@amigoconnect.com / +91 99712 99631) will
                      get back to you shortly.
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
                      className="bg-gradient-to-r from-coral-500 to-[#29ABE2] hover:from-coral-600 hover:to-[#0284C7] text-white font-display font-black uppercase tracking-wider text-xs px-7 py-4 rounded-xl transition-all shadow-glow"
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
      <footer className="bg-navy-950 text-slate-400 py-14 border-t-2 border-[#29ABE2]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="h-12 px-2.5 rounded-2xl bg-[#C5D887] flex items-center justify-center border border-[#F26522] shrink-0">
                <img
                  src="/assets/ddr-logo.png"
                  alt="Delhi Dwarka Runners Logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <div className="font-display font-black text-white text-sm uppercase">
                  <span className="text-[#29ABE2]">DELHI DWARKA</span>{" "}
                  <span className="text-coral-500">RUNNERS</span> • 4TH EDITION DWARKA HALF MARATHON
                </div>
                <div className="text-slate-300 mt-0.5">
                  Starting Point: Max Hospital, Sector 10, Dwarka, New Delhi • Operated by AMIGO CONNECT (AMIGOCONNECT.COM)
                </div>
                <div className="text-[#C5D887] font-semibold mt-0.5">
                  ✉️{" "}
                  <a href="mailto:padam@amigoconnect.com" className="hover:underline">
                    padam@amigoconnect.com
                  </a>{" "}
                  • Grievance:{" "}
                  <a href="mailto:grievance@amigoconnect.com" className="hover:underline">
                    grievance@amigoconnect.com
                  </a>{" "}
                  • 📞{" "}
                  <a href="tel:+919971299631" className="hover:underline">
                    +91 99712 99631
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-5 font-semibold text-slate-300 items-center">
              <a href="#home" className="hover:text-[#29ABE2]">
                Home
              </a>
              <a href="#categories" className="hover:text-coral-400">
                Categories
              </a>
              <a href="#about" className="hover:text-[#C5D887]">
                About Event
              </a>
              <a href="/terms-and-conditions" className="text-[#C5D887] hover:text-white underline font-bold">
                Terms &amp; Conditions
              </a>
              <a href="/privacy-policy" className="text-[#C5D887] hover:text-white underline font-bold">
                Privacy Policy
              </a>
              <a
                href="/admin"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-coral-500 text-[#C5D887] hover:text-white font-display font-bold transition-colors"
              >
                🔒 Organizer Portal (Export Registrations)
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-2 text-[11px] text-slate-400 leading-relaxed">
            <div className="font-display font-bold uppercase text-slate-300">Disclaimer</div>
            {DISCLAIMER_TEXT.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            <div className="pt-2 text-slate-500 flex flex-wrap justify-between gap-2">
              <span>© 2026–2027 Delhi Dwarka Runners (DDR) &amp; AMIGO CONNECT (AMIGOCONNECT.COM). All rights reserved.</span>
              <span>Grievance Officer: Padam Sharma (Director - Product &amp; New Community Initiatives) • grievance@amigoconnect.com</span>
            </div>
          </div>
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
