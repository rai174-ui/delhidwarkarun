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

const BG_SLIDESHOW_IMAGES = [
  "/backgroundimage/11.jpg",
  "/backgroundimage/14.jpg",
  "/backgroundimage/26.jpg",
  "/backgroundimage/00bac4d6-b8ba-40e3-b1bc-8b338d0ec4c1.jpg",
  "/backgroundimage/c286610d-6f49-473a-a484-a79b739516b4.jpg",
  "/backgroundimage/2.jpeg",
  "/backgroundimage/13.jpg",
  "/backgroundimage/15.jpg",
  "/backgroundimage/16.jpg",
  "/backgroundimage/17.jpg",
  "/backgroundimage/18.jpg",
  "/backgroundimage/19.jpg",
  "/backgroundimage/20.jpg",
  "/backgroundimage/22.jpg",
  "/backgroundimage/23.jpg",
  "/backgroundimage/24.jpg",
  "/backgroundimage/25.jpg",
  "/backgroundimage/27.jpg",
  "/backgroundimage/28.jpg",
  "/backgroundimage/29.jpg",
  "/backgroundimage/3.jpeg",
];

const KIT_HOTSPOTS = [
  {
    id: "jersey",
    title: "Official DDR Neon Lime & Orange Dry-Fit Event Tee",
    desc: "Breathable sweat-wicking athletic race jersey in signature DDR Neon Lime with vibrant Tangerine-Orange sleeves, front DDR runner crest, and polygon runners on the back.",
    spec: "UV-40+ Protection • Front & Back Official DDR Print",
  },
  {
    id: "certificate",
    title: "Official Finisher & Chip-Time Certificates",
    desc: "Verified Finisher & Chip-Timing Certificates signed by B S Rawat (Secretary, DDR) and Sudershan Kumar (President, DDR Dwarka Half Marathon) for all finishers.",
    spec: "Official Timing & Finisher Recognition • Downloadable HD",
  },
  {
    id: "medal",
    title: "3D Zinc-Alloy Finisher Medal & RFID Timing Bib",
    desc: "Heavyweight commemorative 4th Edition medallion and tear-proof RFID timing bib with tear-off stub for the Race Day Lucky Draw.",
    spec: "🎉 Win Exciting Prizes in the Official Lucky Draw!",
  },
  {
    id: "hydration",
    title: "Max Healthcare Support & Post-Run Breakfast",
    desc: "Full medical coverage by Health Partner Max Super Speciality Hospital Sector 10, hydration stations along the route, and hot post-run breakfast.",
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
  const [bgSlideIndex, setBgSlideIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<RaceCategory>(
    RACE_CATEGORIES[0] // Default 21.097 KM Half Marathon
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRouteTab, setActiveRouteTab] = useState<RaceCategory["id"]>("half");
  const [activeHotspot, setActiveHotspot] = useState(KIT_HOTSPOTS[0]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    title: string;
  } | null>(null);
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

  // Auto-advance background images from /backgroundimage folder
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setBgSlideIndex((prev) => (prev + 1) % BG_SLIDESHOW_IMAGES.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

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

  const currentBgImg = BG_SLIDESHOW_IMAGES[bgSlideIndex];
  const nextBgImg = BG_SLIDESHOW_IMAGES[(bgSlideIndex + 1) % BG_SLIDESHOW_IMAGES.length];

  return (
    <div className="min-h-screen flex flex-col relative text-navy-950">
      {/* FIXED RUNNING BACKGROUND SLIDESHOW FROM /backgroundimage FOLDER */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-slate-100">
        {BG_SLIDESHOW_IMAGES.map((src, idx) => {
          const isCurrent = idx === bgSlideIndex;
          const isPrev =
            idx === (bgSlideIndex - 1 + BG_SLIDESHOW_IMAGES.length) % BG_SLIDESHOW_IMAGES.length;
          if (!isCurrent && !isPrev) return null;
          return (
            <img
              key={src}
              src={src}
              alt={`Delhi Dwarka Run Background ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 animate-kenburns ${
                isCurrent ? "opacity-100" : "opacity-0"
              }`}
            />
          );
        })}
        {/* Preload next image smoothly */}
        <link rel="preload" as="image" href={nextBgImg} />
        {/* Light airy wash over fixed background so all foreground content stays crisp and bright */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/55 via-white/65 to-white/75" />
      </div>

      {/* FOREGROUND WRAPPER */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HIGH-ENERGY TICKER MARQUEE — MATCHING DDR LOGO PALETTE */}
        <div className="bg-gradient-to-r from-[#0284C7] via-coral-500 to-[#F26522] text-white py-2 overflow-hidden border-b border-white/40 shadow-sm">
          <div className="animate-marquee flex items-center gap-10 text-xs font-display font-extrabold uppercase tracking-wider">
            {[1, 2].map((loop) => (
              <React.Fragment key={loop}>
                <span className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white text-coral-600 rounded text-[10px] font-black">
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

        {/* STICKY LIGHT FROSTED-GLASS NAVBAR WITH OFFICIAL DDR LOGO */}
        <header className="sticky top-0 z-40 bg-white/88 backdrop-blur-xl border-b-2 border-[#29ABE2]/35 text-navy-950 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="#home" className="flex items-center gap-3.5 group">
              <div className="h-14 px-2.5 rounded-2xl bg-[#C5D887] flex items-center justify-center shadow-md border-2 border-[#F26522] group-hover:scale-105 transition-transform relative overflow-hidden shrink-0">
                <img
                  src="/assets/ddr-logo.png?v=3"
                  alt="Delhi Dwarka Runners (DDR) Official Logo"
                  className="h-11 w-auto object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-[#0284C7]">
                    DELHI DWARKA
                  </span>
                  <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-coral-600">
                    RUNNERS
                  </span>
                  <span className="hidden sm:inline-block ml-1 px-2 py-0.5 rounded bg-[#C5D887] text-navy-950 font-display font-black text-[10px] uppercase border border-[#F26522]/40">
                    2027
                  </span>
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-600">
                  4th Edition Dwarka Half Marathon • 14-Feb-2027
                </div>
              </div>
            </a>

            <nav className="hidden lg:flex items-center gap-7 text-xs font-display font-extrabold uppercase tracking-wider text-navy-900">
              <a href="#home" className="hover:text-[#0284C7] transition-colors">
                Home
              </a>
              <a href="#categories" className="hover:text-coral-600 transition-colors">
                Categories (50% Off)
              </a>
              <a href="#race-kit" className="hover:text-[#0284C7] transition-colors">
                Race Kit
              </a>
              <a href="#route-map" className="hover:text-coral-600 transition-colors">
                Route Map
              </a>
              <a href="#about" className="hover:text-[#0284C7] transition-colors">
                Highlights
              </a>
              <a href="#faq" className="hover:text-coral-600 transition-colors">
                FAQs
              </a>
              <a href="#contact" className="hover:text-[#0284C7] transition-colors">
                Contact
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleOpenRegister()}
                className="bg-gradient-to-r from-coral-500 via-[#F26522] to-[#0284C7] text-white font-display font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
              >
                <span>Register @ 50% Off</span>
                <span>→</span>
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-navy-950 hover:bg-slate-200 border border-slate-300"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 text-navy-950">
              <div className="grid grid-cols-2 gap-2 text-xs font-display font-bold uppercase tracking-wider">
                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-slate-100">
                  Home
                </a>
                <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-slate-100">
                  Categories
                </a>
                <a href="#race-kit" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-slate-100">
                  Race Kit
                </a>
                <a href="#route-map" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-slate-100">
                  Route Map
                </a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-slate-100">
                  Highlights
                </a>
                <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-lg bg-slate-100">
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

        {/* HERO SECTION — RUNNING BACKGROUND IMAGES WITH LIGHT FROSTED FOREGROUND */}
        <section id="home" className="relative overflow-hidden min-h-[88vh] flex flex-col justify-between">
          {/* Active Hero Background Layer */}
          <div className="absolute inset-0 z-0">
            {heroBgVideo ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover opacity-75 scale-105"
              >
                <source src="/race-reel.mp4" type="video/mp4" />
              </video>
            ) : (
              <img
                src={currentBgImg}
                alt="Delhi Dwarka Run 2027 — Running Background"
                className="w-full h-full object-cover object-center opacity-85 animate-kenburns transition-all duration-1000"
              />
            )}
            {/* Lighter Foreground Gradient Wash so background runners remain vivid while dark/coloured text pops */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/88 via-white/72 to-white/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/45" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:py-16 w-full">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left 7 Cols: Light Frosted Glass Hero Foreground Card */}
              <div className="lg:col-span-7 space-y-5 bg-white/80 backdrop-blur-xl border-2 border-white/90 rounded-3xl p-6 sm:p-8 shadow-2xl">
                {/* Official DDR Logo Crest + Partner & Event Date Pills */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#C5D887] border border-[#F26522]/50 shadow-sm">
                    <img
                      src="/assets/ddr-logo.png?v=3"
                      alt="DDR Logo"
                      className="h-6 w-auto object-contain"
                    />
                    <span className="text-xs font-display font-black uppercase tracking-wider text-navy-950">
                      DELHI DWARKA RUNNERS
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-500 text-white shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
                    <span className="text-xs font-display font-extrabold uppercase tracking-wider">
                      EVENT DATE: 14-Feb-2027
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#0284C7]/40 text-xs font-display font-bold text-[#0369A1]">
                    🏥 Health Partner: MAX Healthcare
                  </div>

                  <button
                    onClick={() => setHeroBgVideo(!heroBgVideo)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-navy-900 shadow-sm transition-all"
                  >
                    <span>{heroBgVideo ? "📸 Switch to Photo Slideshow" : "🎥 Play Video BG"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs sm:text-sm font-display font-black uppercase tracking-[0.16em] text-[#0369A1]">
                    📍 STARTING POINT: MAX HOSPITAL, SECTOR 10, DWARKA, NEW DELHI
                  </div>
                  <h1 className="font-display font-black italic text-3xl sm:text-5xl lg:text-[52px] leading-[1.05] tracking-tight uppercase text-navy-950">
                    4th Edition of Dwarka Half Marathon:{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284C7] via-coral-600 to-[#F26522] block sm:inline">
                      Delhi Dwarka Run 2027
                    </span>
                  </h1>
                </div>

                {/* Sage-Lime & Cyan-Blue Logo Styled Quote Banner */}
                <div className="inline-block bg-[#C5D887]/90 border-2 border-[#F26522] rounded-2xl px-4 py-2.5 shadow-sm">
                  <p className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-navy-950">
                    ★ Be a Part of the Biggest Running Event of Dwarka. Create Lifetime Memories. ★
                  </p>
                </div>

                {/* Dual Promo Badges: 50% Discount + Lucky Draw (Light Foreground Cards) */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="bg-gradient-to-br from-sky-50 to-white border-2 border-[#0284C7] rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                    <div className="w-13 h-13 px-2.5 py-2 rounded-2xl bg-[#0284C7] text-white font-athletic font-bold text-3xl flex flex-col items-center justify-center leading-none shrink-0">
                      <span>50%</span>
                      <span className="text-[10px] font-display font-black">OFF</span>
                    </div>
                    <div>
                      <div className="font-display font-black text-xs sm:text-sm uppercase text-[#0369A1]">
                        50% Discount Till 30-Nov-2026!
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5 font-medium">
                        Auto-applied • Code: <strong className="text-coral-600">DDR50</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-[#F26522] rounded-2xl p-3.5 flex items-center gap-3 shadow-md">
                    <div className="h-12 px-2 rounded-xl bg-[#C5D887] border border-[#F26522]/40 flex items-center justify-center shrink-0">
                      <img
                        src="/assets/ddr-logo.png?v=3"
                        alt="DDR Logo"
                        className="h-9 w-auto object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-display font-black text-xs sm:text-sm uppercase text-coral-600">
                        🎉 Lucky Draw Included!
                      </div>
                      <div className="text-xs text-slate-700 mt-0.5 font-medium">
                        Win Exciting Prizes &amp; More on Race Day!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Light Frosted Countdown Cards to 14-Feb-2027 */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-display font-extrabold uppercase tracking-widest text-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-coral-500" />
                      Countdown to Flag-Off (14-Feb-2027 • 05:30 AM)
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0284C7]">
                      <button
                        type="button"
                        onClick={() =>
                          setBgSlideIndex(
                            (prev) => (prev - 1 + BG_SLIDESHOW_IMAGES.length) % BG_SLIDESHOW_IMAGES.length
                          )
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 border border-slate-300"
                        title="Previous Background Photo"
                      >
                        ◀
                      </button>
                      <span className="font-mono text-[10px] text-slate-600">
                        BG {bgSlideIndex + 1}/{BG_SLIDESHOW_IMAGES.length}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setBgSlideIndex((prev) => (prev + 1) % BG_SLIDESHOW_IMAGES.length)
                        }
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-navy-900 border border-slate-300"
                        title="Next Background Photo"
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 max-w-lg">
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
                          className="relative bg-white/95 border-2 border-[#0284C7]/35 rounded-2xl p-3 text-center shadow-md overflow-hidden"
                        >
                          <div className="font-athletic font-bold text-3xl sm:text-5xl text-navy-950 leading-none tracking-wide tabular-nums">
                            {String(item.value).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#0284C7] mt-1">
                            {item.label}
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#0284C7] via-coral-500 to-[#F26522] h-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-1 flex flex-wrap items-center gap-3.5">
                  <button
                    onClick={() => handleOpenRegister()}
                    className="bg-gradient-to-r from-coral-500 via-[#F26522] to-[#0284C7] hover:from-coral-600 hover:to-[#0369A1] text-white font-display font-black uppercase tracking-wider text-sm sm:text-base px-7 py-4 rounded-2xl shadow-glow-lg hover:scale-[1.02] transition-all flex items-center gap-3"
                  >
                    <span>Register Your Spot (50% OFF)</span>
                    <span className="bg-white/20 px-2.5 py-1 rounded-lg text-xs">From ₹800</span>
                  </button>

                  <button
                    onClick={() => setVideoModalOpen(true)}
                    className="bg-white hover:bg-slate-50 border-2 border-[#0284C7]/40 text-navy-950 font-display font-bold text-sm px-5 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-3 group"
                  >
                    <span className="w-9 h-9 rounded-xl bg-[#0284C7] text-white group-hover:scale-110 transition-transform flex items-center justify-center shadow">
                      ▶
                    </span>
                    <div className="text-left">
                      <div className="text-xs font-extrabold uppercase tracking-wider text-navy-950">
                        Watch Official Reel
                      </div>
                      <div className="text-[10px] text-slate-600 font-semibold">DDR Half Marathon Video</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right 5 Cols: Light Frosted-Glass Category Pricing Stack */}
              <div className="lg:col-span-5">
                <div className="bg-white/88 backdrop-blur-2xl border-2 border-[#0284C7]/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-display font-black uppercase tracking-widest text-coral-600">
                        ⚡ 50% OFF TILL 30-NOV-2026
                      </span>
                      <h2 className="font-display font-black text-xl text-navy-950 uppercase tracking-tight">
                        Choose Your Race Category
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#C5D887] border border-[#F26522]/40 text-navy-950 text-[11px] font-extrabold">
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
                              ? "bg-gradient-to-r from-sky-50 via-white to-orange-50 text-navy-950 border-coral-500 shadow-lg scale-[1.01]"
                              : "bg-white/90 text-navy-950 border-slate-200 hover:border-[#0284C7]/60"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-athletic font-bold text-3xl sm:text-4xl text-navy-950 leading-none">
                                  {cat.distance}
                                </span>
                                <span className="px-2 py-0.5 text-[9px] font-display font-black uppercase rounded bg-coral-500 text-white">
                                  50% OFF
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                                {cat.name} • Start: {cat.startTime}
                              </p>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs sm:text-sm font-display font-bold text-slate-400 line-through">
                                RS. {cat.originalFee}
                              </div>
                              <div className="font-display font-black text-xl sm:text-2xl text-emerald-600">
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
                    className="mt-5 w-full bg-gradient-to-r from-coral-500 via-[#F26522] to-[#0284C7] hover:from-coral-600 hover:to-[#0369A1] text-white font-display font-black uppercase tracking-wider text-sm py-4 rounded-2xl shadow-glow transition-all flex items-center justify-center gap-2"
                  >
                    <span>
                      Register {selectedCategory.distance} @ RS. {selectedCategory.fee}
                    </span>
                    <span>→</span>
                  </button>

                  <p className="text-center text-[11px] text-slate-600 mt-3 font-medium">
                    📍 Starting Point: <strong className="text-navy-950">{START_VENUE}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTINUOUS RUNNING MARATHON PHOTO STRIP (ALL 21 IMAGES FROM /backgroundimage) */}
          <div className="relative z-10 bg-white/75 backdrop-blur-md border-t border-white/80 py-3 overflow-hidden">
            <div className="animate-photo-reel flex items-center gap-3 px-3">
              {[...BG_SLIDESHOW_IMAGES, ...BG_SLIDESHOW_IMAGES].map((imgSrc, i) => (
                <div
                  key={`${imgSrc}-${i}`}
                  onClick={() =>
                    setLightboxImage({
                      src: imgSrc,
                      title: "Delhi Dwarka Runners (DDR) — Live Marathon Moments",
                    })
                  }
                  className="relative h-20 sm:h-24 w-36 sm:w-44 rounded-xl overflow-hidden shrink-0 border-2 border-white shadow-sm cursor-pointer group"
                >
                  <img
                    src={imgSrc}
                    alt={`DDR Runner Moment ${(i % BG_SLIDESHOW_IMAGES.length) + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OFFICIAL ACCREDITATIONS & PARTNERS RIBBON (LIGHT FROSTED FOREGROUND) */}
        <section className="bg-white/85 backdrop-blur-md border-y border-slate-200/90 py-6 text-navy-950 shadow-sm">
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
                  className="bg-white/95 border border-slate-200/90 rounded-2xl p-3.5 shadow-sm hover:border-[#0284C7] transition-colors"
                >
                  <div className="text-[9px] font-display font-extrabold uppercase tracking-widest text-[#0284C7]">
                    {item.tag}
                  </div>
                  <div className="font-display font-black text-sm text-navy-950 mt-0.5">
                    {item.title}
                  </div>
                  <div className="text-[11px] font-semibold text-coral-600">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* RACE CATEGORIES SECTION WITH 50% DISCOUNT CARDS (LIGHT TRANSLUCENT FOREGROUND) */}
        <section id="categories" className="py-20 bg-white/75 backdrop-blur-md asphalt-grid">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6 bg-white/85 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white shadow-sm">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-display font-extrabold text-xs uppercase tracking-widest mb-3">
                  <span>🔥 Flat 50% Discount Applicable Till 30-Nov-2026</span>
                </div>
                <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-950 uppercase tracking-tight">
                  4 Race Categories — 14-Feb-2027
                </h2>
              </div>
              <p className="text-slate-700 max-w-md text-sm sm:text-base font-medium">
                Starting from <strong>Max Hospital, Sector 10, Dwarka, New Delhi</strong>. Every
                participant receives a Finisher Medal, Race T-Shirt, Bib, Breakfast, and Lucky Draw
                entry!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
              {RACE_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`group bg-white/95 backdrop-blur-md rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
                    cat.popular
                      ? "border-coral-500 shadow-2xl ring-4 ring-coral-500/15 lg:-translate-y-3"
                      : "border-slate-200/90 shadow-card hover:shadow-2xl hover:-translate-y-2"
                  }`}
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span
                          className={`px-3 py-1 rounded-lg bg-gradient-to-r ${cat.color} text-white text-[10px] font-display font-black uppercase tracking-wider shadow`}
                        >
                          {cat.badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white/90 text-coral-600 text-[11px] font-extrabold shadow">
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

            {/* INTERACTIVE PACE & CORRAL CALCULATOR WIDGET (LIGHT FOREGROUND CARD) */}
            <div className="mt-16 bg-white/92 backdrop-blur-xl rounded-3xl p-6 sm:p-10 text-navy-950 shadow-xl border-2 border-[#0284C7]/35">
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-2">
                  <span className="text-xs font-display font-black uppercase tracking-widest text-coral-600">
                    ⏱️ Interactive Runner Tool
                  </span>
                  <h3 className="font-display font-black italic text-2xl sm:text-3xl uppercase text-navy-950">
                    Target Pace &amp; Corral Calculator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Plan your race strategy across our 21.097 KM, 10.5 KM, 5 KM, or 3 KM distances.
                  </p>
                </div>

                <div className="lg:col-span-4 grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Distance
                    </label>
                    <select
                      value={calcDist}
                      onChange={(e) => setCalcDist(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-xs sm:text-sm font-bold text-navy-950"
                    >
                      <option value={21.097}>21.097 KM</option>
                      <option value={10.5}>10.5 KM</option>
                      <option value={5}>5 KM</option>
                      <option value={3}>3 KM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Hours
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={4}
                      value={calcHours}
                      onChange={(e) => setCalcHours(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-sm font-bold text-navy-950"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-display font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Minutes
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={calcMins}
                      onChange={(e) => setCalcMins(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-3 text-sm font-bold text-navy-950"
                    />
                  </div>
                </div>

                <div className="lg:col-span-3 bg-gradient-to-br from-sky-50 to-orange-50 border-2 border-[#0284C7]/30 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-display font-black uppercase text-coral-600">
                      Required Pace
                    </div>
                    <div className="font-athletic font-bold text-4xl text-navy-950 leading-none mt-1">
                      {paceResult.pace} <span className="text-base font-sans text-slate-500">/km</span>
                    </div>
                    <div className="text-[11px] text-[#0284C7] font-bold mt-1">
                      {paceResult.corral}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Avg Speed</div>
                    <div className="font-display font-black text-lg text-navy-950">
                      {paceResult.speed} km/h
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OFFICIAL 2027 EVENT TEE, FINISHER CERTIFICATES & RACE KIT SHOWCASE (LIGHT FOREGROUND) */}
        <section id="race-kit" className="py-20 bg-slate-50/80 backdrop-blur-md text-navy-950 relative overflow-hidden border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto bg-white/88 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white shadow-sm">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#C5D887] text-navy-950 font-display font-black text-xs uppercase tracking-widest mb-3">
                👕 Official Event Tee &amp; Finisher Certificates
              </span>
              <h2 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight text-navy-950">
                Official Event Tee, Certificates &amp; Race Kit
              </h2>
              <p className="text-slate-600 mt-3 text-sm sm:text-base font-medium">
                Organized by <strong>Delhi Dwarka Runners (DDR)</strong> with Health Partner{" "}
                <strong>Max Healthcare</strong>. Starting from{" "}
                <strong>Max Super Speciality Hospital, Sector 10, Dwarka, New Delhi</strong> on{" "}
                <strong>14-Feb-2027</strong>.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Left 7 Cols: Official Event Tee (Front & Back View) */}
              <div className="lg:col-span-7">
                <div
                  onClick={() =>
                    setLightboxImage({
                      src: "/assets/event-tee-2027.png",
                      title: "Official DDR Event Tee (Front & Back View)",
                    })
                  }
                  className="relative rounded-3xl overflow-hidden border-2 border-[#0284C7]/40 bg-white/95 p-6 sm:p-8 shadow-xl group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#C5D887] text-navy-950 font-display font-black text-[11px] uppercase tracking-wider">
                      👕 Official DDR Dry-Fit Event Tee (Front &amp; Back)
                    </span>
                    <span className="text-xs font-bold text-coral-600">
                      🔍 Click to Enlarge
                    </span>
                  </div>
                  <img
                    src="/assets/event-tee-2027.png"
                    alt="Delhi Dwarka Run 2027 Official Event T-Shirt Front and Back View"
                    className="w-full h-auto object-contain max-h-[420px] mx-auto group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-black text-base sm:text-lg text-navy-950">
                        Signature Neon Lime &amp; Tangerine-Orange DDR Race Jersey
                      </h3>
                      <p className="text-xs text-slate-600">
                        Included with every registration across 21.097 KM, 10.5 KM, 5 KM &amp; 3 KM
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRegister();
                      }}
                      className="bg-gradient-to-r from-coral-500 to-[#0284C7] text-white font-display font-black text-xs uppercase px-5 py-3 rounded-xl shadow-glow transition-transform hover:scale-105"
                    >
                      Book Your Size @ 50% Off →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right 5 Cols: Gear Breakdown (Light Frosted Cards) */}
              <div className="lg:col-span-5 space-y-4">
                {KIT_HOTSPOTS.map((item) => {
                  const isActive = activeHotspot.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setActiveHotspot(item)}
                      className={`cursor-pointer rounded-2xl p-5 transition-all border-2 ${
                        isActive
                          ? "bg-white border-coral-500 shadow-lg"
                          : "bg-white/85 border-slate-200 hover:bg-white hover:border-[#0284C7]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-extrabold text-base text-navy-950">
                          {item.title}
                        </h4>
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isActive ? "bg-coral-500" : "bg-slate-300"
                          }`}
                        />
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="mt-2.5 inline-block px-2.5 py-1 rounded bg-[#C5D887]/40 border border-[#C5D887] text-[11px] font-mono font-bold text-navy-900">
                        {item.spec}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* OFFICIAL FINISHER CERTIFICATES SHOWCASE (LIGHT FROSTED CARD) */}
            <div className="bg-white/90 backdrop-blur-xl border-2 border-[#0284C7]/30 rounded-3xl p-6 sm:p-10 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-xs font-display font-black uppercase tracking-widest text-coral-600">
                    📜 Official DDR Finisher Recognition
                  </span>
                  <h3 className="font-display font-black italic text-2xl sm:text-3xl text-navy-950 uppercase mt-1">
                    Official Finisher &amp; Chip-Time Certificates
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                  Every finisher receives an official DDR Certificate signed by{" "}
                  <strong className="text-navy-950">B S Rawat (Secretary)</strong> and{" "}
                  <strong className="text-navy-950">Sudershan Kumar (President)</strong>. Click any
                  certificate below to preview in full size.
                </p>
              </div>

              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div
                  onClick={() =>
                    setLightboxImage({
                      src: "/assets/certificate-1.png",
                      title: "Official DDR Finisher Certificate (Landscape Edition)",
                    })
                  }
                  className="md:col-span-7 bg-slate-50 rounded-2xl p-3 sm:p-4 border-2 border-[#C5D887] shadow-md cursor-pointer group overflow-hidden"
                >
                  <img
                    src="/assets/certificate-1.png"
                    alt="Official DDR Half Marathon Finisher Certificate"
                    className="w-full h-auto max-h-[380px] object-contain mx-auto rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="flex items-center justify-between pt-3 px-1 text-xs font-display font-bold text-navy-950">
                    <span>🏅 Official DDR Finisher Certificate</span>
                    <span className="text-coral-600">🔍 Click to Zoom</span>
                  </div>
                </div>

                <div
                  onClick={() =>
                    setLightboxImage({
                      src: "/assets/certificate-2.png",
                      title: "Official DDR Half Marathon Chip-Time Finisher Certificate",
                    })
                  }
                  className="md:col-span-5 bg-slate-50 rounded-2xl p-3 sm:p-4 border-2 border-[#0284C7]/50 shadow-md cursor-pointer group overflow-hidden"
                >
                  <img
                    src="/assets/certificate-2.png"
                    alt="Official DDR Half Marathon Chip-Time Certificate"
                    className="w-full h-auto max-h-[380px] object-contain mx-auto rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="flex items-center justify-between pt-3 px-1 text-xs font-display font-bold text-navy-950">
                    <span>⏱️ Official Chip-Time Finisher Certificate</span>
                    <span className="text-[#0284C7]">🔍 Click to Zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OFFICIAL ROUTE MAP SECTION (LIGHT FOREGROUND) */}
        <section id="route-map" className="py-20 bg-white/80 backdrop-blur-md border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-white/90 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full bg-[#0284C7]/15 text-[#0284C7] font-display font-black text-xs uppercase tracking-widest mb-2">
                  📍 Start &amp; Finish: Max Super Speciality Hospital, Sector 10, Dwarka
                </span>
                <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-950 uppercase tracking-tight">
                  Official Race Route &amp; U-Turn Map
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
              {/* Left 7 Cols: Official Route Map Image (Light Card) */}
              <div className="lg:col-span-7 bg-white/95 rounded-3xl p-5 sm:p-7 text-navy-950 shadow-xl border-2 border-[#0284C7]/30 flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-coral-600 font-display font-extrabold">
                      Official Course Map • Start/Finish: Max Super Speciality Hospital Dwarka
                    </span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-navy-950">
                      {ROUTE_DATA[activeRouteTab].title}
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      setLightboxImage({
                        src: "/assets/route-map-official.png",
                        title: "Official DDR Race Route Map (3 KM, 5 KM, 10.5 KM & 21.1 KM U-Turns)",
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-[#0284C7]/30 text-xs font-display font-bold text-[#0284C7] transition-colors"
                  >
                    🔍 View Full Map
                  </button>
                </div>

                <div
                  onClick={() =>
                    setLightboxImage({
                      src: "/assets/route-map-official.png",
                      title: "Official DDR Race Route Map (3 KM, 5 KM, 10.5 KM & 21.1 KM U-Turns)",
                    })
                  }
                  className="bg-slate-50 rounded-2xl border-2 border-[#0284C7]/30 p-2 overflow-hidden cursor-pointer group"
                >
                  <img
                    src="/assets/route-map-official.png"
                    alt="Delhi Dwarka Run Official Route Map showing Start/Finish at Max Super Speciality Hospital Dwarka and U-Turns for 3 KM, 5 KM, 10.5 KM and 21.1 KM"
                    className="w-full h-auto max-h-[540px] object-contain mx-auto rounded-xl group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {/* Official U-Turn Key Strip */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-orange-50/80 border border-coral-500/30 rounded-xl p-3">
                    <div className="text-[10px] font-display font-black uppercase text-coral-600">
                      🏁 START / FINISH
                    </div>
                    <div className="font-bold text-navy-950 mt-0.5">
                      Max Super Speciality Hospital
                    </div>
                    <div className="text-[10px] text-slate-500">Sector 10, Dwarka</div>
                  </div>
                  <div className="bg-lime-50 border border-[#C5D887] rounded-xl p-3">
                    <div className="text-[10px] font-display font-black uppercase text-emerald-700">
                      ↩️ 3 KM U-TURN
                    </div>
                    <div className="font-bold text-navy-950 mt-0.5">
                      Muthoot Finance
                    </div>
                    <div className="text-[10px] text-slate-500">Golf Course Rd</div>
                  </div>
                  <div className="bg-sky-50 border border-[#0284C7]/30 rounded-xl p-3">
                    <div className="text-[10px] font-display font-black uppercase text-[#0284C7]">
                      ↩️ 5 KM U-TURN
                    </div>
                    <div className="font-bold text-navy-950 mt-0.5">
                      Golf Course Rd
                    </div>
                    <div className="text-[10px] text-slate-500">Before Canal Bridge</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-500/30 rounded-xl p-3">
                    <div className="text-[10px] font-display font-black uppercase text-emerald-700">
                      ↩️ 10.5 &amp; 21.1 KM
                    </div>
                    <div className="font-bold text-navy-950 mt-0.5">
                      Kakrola Turnaround
                    </div>
                    <div className="text-[10px] text-slate-500">Via Venkateshwar Hosp.</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 h-full flex flex-col justify-between shadow-lg">
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-display font-black uppercase text-coral-600">
                        Course Turn-by-Turn &amp; Landmarks
                      </span>
                      <h3 className="font-display font-extrabold text-xl text-navy-950 mt-1">
                        {ROUTE_DATA[activeRouteTab].title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {ROUTE_DATA[activeRouteTab].pathDesc}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[11px] font-display font-extrabold uppercase tracking-wider text-slate-400">
                        Key Landmarks Along This Route
                      </div>
                      <ul className="space-y-1.5 text-xs text-navy-950 font-semibold">
                        {ROUTE_DATA[activeRouteTab].landmarks.map((lm, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-coral-500/15 text-coral-600 flex items-center justify-center text-[10px] font-black shrink-0">
                              {i + 1}
                            </span>
                            <span>{lm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-display font-extrabold uppercase tracking-wider text-slate-400 mb-3">
                      Race Morning Timeline (Sun, 14th Feb 2027)
                    </div>
                    <div className="space-y-2">
                      {RACE_DAY_SCHEDULE.map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/80 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-coral-600">{s.time}</span>
                            <span className="font-semibold text-navy-950">{s.event}</span>
                          </div>
                          <span className="text-[10px] font-bold bg-white text-slate-600 px-2 py-0.5 rounded border border-slate-200 hidden sm:inline">
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

        {/* FINISH LINE FESTIVAL & VIDEO HIGHLIGHTS BENTO SECTION (LIGHT FOREGROUND) */}
        <section id="about" className="py-20 bg-slate-50/80 backdrop-blur-md text-navy-950 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-white/90 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <div>
                <span className="text-coral-600 font-display font-black text-xs uppercase tracking-widest">
                  🎬 4th Edition Race Atmosphere &amp; Highlights
                </span>
                <h2 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight mt-1 text-navy-950">
                  Be a Part of the Biggest Running Event of Dwarka
                </h2>
              </div>
              <p className="text-slate-600 text-sm max-w-md font-medium">
                Create lifetime memories with thousands of runners, live Dhol beats, Lucky Draw
                prizes, and Max Healthcare wellness zones at Max Hospital, Sector 10, Dwarka.
              </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl flex flex-col justify-between">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-coral-500 animate-pulse" />
                    <span className="font-display font-extrabold text-xs uppercase tracking-wider text-navy-950">
                      Official Highlight Reel — DDR Dwarka Half Marathon
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#0284C7]">1080p HD</span>
                </div>
                <video
                  controls
                  preload="metadata"
                  poster="/backgroundimage/11.jpg"
                  className="w-full aspect-video object-cover bg-slate-900"
                >
                  <source src="/race-reel.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl flex-1 min-h-[240px] group">
                  <img
                    src={currentBgImg}
                    alt="DDR Marathon Celebration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
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
                  <div className="bg-white/95 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                    <div className="font-athletic font-bold text-4xl text-emerald-600">50% OFF</div>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      Valid Till 30-Nov-2026
                    </div>
                  </div>
                  <div className="bg-white/95 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                    <div className="font-athletic font-bold text-4xl text-coral-600">4th</div>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      Championship Edition
                    </div>
                  </div>
                  <div className="bg-white/95 border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
                    <div className="font-athletic font-bold text-4xl text-[#0284C7]">14 FEB</div>
                    <div className="text-[11px] text-slate-600 font-semibold">
                      2027 Race Date
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT EVENT DETAILS: WHY PARTICIPATE, WHO SHOULD JOIN & EXPERIENCE (LIGHT CARDS) */}
            <div className="mt-12 grid lg:grid-cols-3 gap-6">
              <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-md">
                <span className="inline-block px-3 py-1 rounded-full bg-coral-500/15 text-coral-600 font-display font-black text-xs uppercase tracking-wider">
                  About The Event
                </span>
                <h3 className="font-display font-black text-xl text-navy-950 uppercase">
                  The DDR Marathon Experience
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {ABOUT_EVENT_CONTENT.intro.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {ABOUT_EVENT_CONTENT.experience.map((p, i) => (
                    <p key={`exp-${i}`} className="text-navy-900 font-medium">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-4 shadow-md">
                <span className="inline-block px-3 py-1 rounded-full bg-[#0284C7]/15 text-[#0284C7] font-display font-black text-xs uppercase tracking-wider">
                  Why Participate
                </span>
                <h3 className="font-display font-black text-xl text-navy-950 uppercase">
                  Why Run in Delhi Dwarka Run (DDR)
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
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

              <div className="bg-white/95 border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-4 shadow-md">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#C5D887] text-navy-950 font-display font-black text-xs uppercase tracking-wider">
                    Who Should Join
                  </span>
                  <h3 className="font-display font-black text-xl text-navy-950 uppercase">
                    Designed For Every Runner
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {ABOUT_EVENT_CONTENT.whoShouldJoin.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-coral-500 font-bold">★</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="text-xs font-display font-bold text-coral-600 uppercase mb-2">
                    Register Now — 50% Early Bird Offer LIVE
                  </div>
                  <button
                    onClick={() => handleOpenRegister()}
                    className="w-full bg-gradient-to-r from-coral-500 to-[#0284C7] text-white font-display font-black uppercase text-xs py-3.5 rounded-xl shadow-glow"
                  >
                    Secure Your Spot Today →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION (LIGHT TRANSLUCENT FOREGROUND) */}
        <section id="faq" className="py-20 bg-white/82 backdrop-blur-md border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white/95 shadow-sm"
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
                      <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3 bg-slate-50/70">
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT & GROUP ENTRIES SECTION (LIGHT TRANSLUCENT FOREGROUND) */}
        <section id="contact" className="py-20 bg-slate-50/85 backdrop-blur-md border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-5 bg-white/90 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C5D887] text-navy-950 font-display font-black text-xs uppercase tracking-widest">
                  <img
                    src="/assets/ddr-logo.png?v=3"
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
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="font-display font-bold text-navy-950">
                      📍 Starting &amp; Finishing Point
                    </div>
                    <div className="text-slate-600 text-xs mt-0.5">
                      Max Hospital, Sector 10, Dwarka, New Delhi – 110075
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
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
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
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
                <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card">
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
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                        <input
                          required
                          type="email"
                          placeholder="Email Address *"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <input
                          required
                          type="tel"
                          placeholder="Mobile Number *"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
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
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-coral-500 to-[#0284C7] hover:from-coral-600 hover:to-[#0369A1] text-white font-display font-black uppercase tracking-wider text-xs px-7 py-4 rounded-xl transition-all shadow-glow"
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

        {/* LIGHT FROSTED FOOTER */}
        <footer className="bg-white/92 backdrop-blur-xl text-slate-600 py-14 border-t-2 border-[#0284C7]/35">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3.5">
                <div className="h-12 px-2.5 rounded-2xl bg-[#C5D887] flex items-center justify-center border border-[#F26522] shrink-0 shadow-sm">
                  <img
                    src="/assets/ddr-logo.png?v=3"
                    alt="Delhi Dwarka Runners Logo"
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <div>
                  <div className="font-display font-black text-navy-950 text-sm uppercase">
                    <span className="text-[#0284C7]">DELHI DWARKA</span>{" "}
                    <span className="text-coral-600">RUNNERS</span> • 4TH EDITION DWARKA HALF MARATHON
                  </div>
                  <div className="text-slate-600 mt-0.5 font-medium">
                    Starting Point: Max Hospital, Sector 10, Dwarka, New Delhi • Operated by AMIGO CONNECT (AMIGOCONNECT.COM)
                  </div>
                  <div className="text-navy-900 font-bold mt-0.5">
                    ✉️{" "}
                    <a href="mailto:padam@amigoconnect.com" className="text-[#0284C7] hover:underline">
                      padam@amigoconnect.com
                    </a>{" "}
                    • Grievance:{" "}
                    <a href="mailto:grievance@amigoconnect.com" className="text-coral-600 hover:underline">
                      grievance@amigoconnect.com
                    </a>{" "}
                    • 📞{" "}
                    <a href="tel:+919971299631" className="text-[#0284C7] hover:underline">
                      +91 99712 99631
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-5 font-bold text-navy-900 items-center">
                <a href="#home" className="hover:text-[#0284C7]">
                  Home
                </a>
                <a href="#categories" className="hover:text-coral-600">
                  Categories
                </a>
                <a href="#about" className="hover:text-[#0284C7]">
                  About Event
                </a>
                <a href="/terms-and-conditions" className="text-[#0284C7] hover:text-coral-600 underline font-extrabold">
                  Terms &amp; Conditions
                </a>
                <a href="/privacy-policy" className="text-[#0284C7] hover:text-coral-600 underline font-extrabold">
                  Privacy Policy
                </a>
                <a
                  href="/admin"
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-coral-500 text-navy-950 hover:text-white border border-slate-300 font-display font-bold transition-colors"
                >
                  🔒 Organizer Portal (Export Registrations)
                </a>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-2 text-[11px] text-slate-500 leading-relaxed">
              <div className="font-display font-bold uppercase text-navy-950">Disclaimer</div>
              {DISCLAIMER_TEXT.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
              <div className="pt-2 text-slate-500 flex flex-wrap justify-between gap-2 font-medium">
                <span>© 2026–2027 Delhi Dwarka Runners (DDR) &amp; AMIGO CONNECT (AMIGOCONNECT.COM). All rights reserved.</span>
                <span>Grievance Officer: Padam Sharma (Director - Product &amp; New Community Initiatives) • grievance@amigoconnect.com</span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-display font-bold text-navy-950 text-sm uppercase tracking-wider">
                Delhi Dwarka Run — Official Race Highlight Reel
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-navy-950 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg font-bold"
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

      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-display font-bold text-navy-950 text-sm uppercase tracking-wider">
                {lightboxImage.title}
              </h3>
              <button
                onClick={() => setLightboxImage(null)}
                className="text-navy-950 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 bg-slate-50 flex items-center justify-center max-h-[82vh] overflow-auto">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-w-full max-h-[76vh] object-contain rounded-xl"
              />
            </div>
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
