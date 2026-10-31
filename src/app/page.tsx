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

export default function DelhiDwarkaRunPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroBgVideo, setHeroBgVideo] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RaceCategory>(
    RACE_CATEGORIES[1]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRouteTab, setActiveRouteTab] = useState<RaceCategory["id"]>("half");
  const [resultsQuery, setResultsQuery] = useState("");
  const [resultsCategoryFilter, setResultsCategoryFilter] = useState("All");
  const [registrations, setRegistrations] = useState<RunnerResult[]>([]);
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
      {/* Top Promo Banner */}
      <div className="bg-gradient-to-r from-coral-600 via-coral-500 to-orange-500 text-white py-2 px-4 text-center text-xs font-display font-extrabold uppercase tracking-wider">
        ⚡ DELHI DWARKA RUN 2027 • SUNDAY, FEB 21, 2027 • ₹10,00,000+ PRIZE POOL • CODE:{" "}
        <u className="text-navy-950">DWARKA2027</u> (10% OFF)
      </div>

      {/* Sticky Header / Navbar */}
      <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-xl border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-coral-500 to-orange-600 flex items-center justify-center shadow-glow font-display font-black">
              DDR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-white">
                  DELHI DWARKA
                </span>
                <span className="font-display font-black italic text-lg sm:text-xl tracking-tight text-coral-500">
                  RUN 2027
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
                Official Marathon Series • New Delhi
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-display font-bold uppercase tracking-wider text-slate-200">
            <a href="#home" className="hover:text-coral-400 transition-colors">
              Home
            </a>
            <a href="#categories" className="hover:text-coral-400 transition-colors">
              Categories
            </a>
            <a href="#race-kit" className="hover:text-coral-400 transition-colors">
              Medal &amp; Kit
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

          <div className="hidden md:flex items-center">
            <button
              onClick={() => handleOpenRegister()}
              className="bg-gradient-to-r from-coral-500 to-orange-600 text-white font-display font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl shadow-glow transition-all"
            >
              Register Now →
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-lg bg-white/10 text-white"
            aria-label="Toggle Menu"
          >
            ☰
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-navy-950 border-b border-white/10 px-4 pt-3 pb-6 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-display font-bold uppercase">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Home
              </a>
              <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Categories
              </a>
              <a href="#race-kit" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Medal &amp; Kit
              </a>
              <a href="#route-map" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Route Map
              </a>
              <a href="#results" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Results
              </a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Contact
              </a>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenRegister();
              }}
              className="w-full bg-coral-500 text-white font-display font-bold py-3 rounded-xl"
            >
              Register Now
            </button>
          </div>
        )}
      </header>

      {/* Hero Section with Custom Sunrise Runners Photography */}
      <section id="home" className="relative bg-navy-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroBgVideo ? (
            <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-45">
              <source src="/DDR%20Dwarka%20Half%20Marathon%202026.m4v" type="video/mp4" />
            </video>
          ) : (
            <img
              src="/assets/hero-runners.jpg"
              alt="Delhi Dwarka Run 2027 Sunrise Runners"
              className="w-full h-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/45" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-full bg-coral-500/20 border border-coral-500/40 text-xs font-display font-extrabold uppercase tracking-wider text-coral-400">
                  Sunday, February 21, 2027 • Dwarka Sec-10 Sports Complex
                </span>
                <button
                  onClick={() => setHeroBgVideo(!heroBgVideo)}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold"
                >
                  {heroBgVideo ? "📸 Switch to Photo View" : "🎥 Play Live Race Video BG"}
                </button>
              </div>

              <h1 className="font-display font-black italic text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight uppercase">
                Conquer the Asphalt:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-coral-500 to-amber-400">
                  Delhi Dwarka Run 2027
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Experience New Delhi&apos;s fastest, flattest championship course across the wide
                tree-lined avenues of Dwarka. Join 12,000+ runners across 42.2K, 21.1K, 10K, and 5K
                categories.
              </p>

              {/* Countdown Timer */}
              <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-lg pt-2">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-navy-900/90 border border-white/15 rounded-2xl p-3 sm:p-4 text-center"
                  >
                    <div className="font-display font-black text-2xl sm:text-4xl text-white tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-coral-400 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleOpenRegister()}
                  className="bg-coral-500 hover:bg-coral-600 text-white font-display font-extrabold uppercase tracking-wider text-sm sm:text-base px-8 py-4 rounded-2xl shadow-glow transition-all"
                >
                  Register Your Spot →
                </button>
              </div>
            </div>

            {/* Right Interactive Selector */}
            <div className="lg:col-span-5">
              <div className="bg-navy-900/85 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-3">
                <h2 className="font-display font-extrabold text-xl text-white uppercase mb-2">
                  Select Your Distance
                </h2>
                {RACE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat)}
                      className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                        isSelected
                          ? "bg-white text-navy-900 border-coral-500 shadow-lg"
                          : "bg-navy-950/70 text-white border-white/10 hover:bg-navy-800/80"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display font-extrabold text-base">{cat.name}</h3>
                          <p
                            className={`text-xs ${
                              isSelected ? "text-slate-600" : "text-slate-300"
                            }`}
                          >
                            Start: {cat.startTime} • {cat.prizePool}
                          </p>
                        </div>
                        <div className="font-display font-black text-lg text-coral-500">
                          ₹{cat.fee}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => handleOpenRegister(selectedCategory)}
                  className="w-full bg-coral-500 hover:bg-coral-600 text-white font-display font-bold uppercase tracking-wider py-4 rounded-xl shadow-glow mt-3"
                >
                  Lock {selectedCategory.distance} Spot — ₹{selectedCategory.fee}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Race Categories Cards Section */}
      <section id="categories" className="py-20 bg-slate-50 asphalt-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-display font-black italic text-3xl sm:text-5xl text-navy-900 uppercase">
              2027 Race Categories
            </h2>
            <p className="text-slate-600 mt-3">
              Select from our 4 signature race distances tailored for every fitness level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {RACE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-navy-950 overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
                    <div className="absolute bottom-3 left-5 text-white">
                      <div className="font-display font-black text-3xl">{cat.distance}</div>
                      <h3 className="font-display font-bold text-base">{cat.name}</h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">{cat.description}</p>
                    <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between">
                      <span>
                        Start: <strong>{cat.startTime}</strong>
                      </span>
                      <span>
                        Cut-off: <strong>{cat.cutoffTime}</strong>
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {cat.perks.map((perk, idx) => (
                        <li key={idx}>✓ {perk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-slate-400">Early Bird Fee</span>
                    <span className="font-display font-black text-2xl text-navy-900">
                      ₹{cat.fee}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenRegister(cat)}
                    className="w-full py-3.5 px-5 rounded-xl bg-navy-900 hover:bg-coral-500 text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Register for {cat.distance} →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Target Pace Calculator */}
          <div className="mt-14 bg-navy-950 rounded-3xl p-6 sm:p-8 text-white grid lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-display font-bold uppercase text-coral-400">
                ⏱️ Interactive Pace Calculator
              </span>
              <h3 className="font-display font-black text-2xl uppercase mt-1">
                Calculate Your Target Split &amp; Wave
              </h3>
            </div>
            <div className="lg:col-span-4 grid grid-cols-3 gap-3">
              <select
                value={calcDist}
                onChange={(e) => setCalcDist(Number(e.target.value))}
                className="bg-navy-900 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-bold"
              >
                <option value={5}>5 KM</option>
                <option value={10}>10 KM</option>
                <option value={21.0975}>21.1 KM</option>
                <option value={42.195}>42.2 KM</option>
              </select>
              <input
                type="number"
                min={0}
                max={6}
                value={calcHours}
                onChange={(e) => setCalcHours(Number(e.target.value))}
                className="bg-navy-900 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-bold"
              />
              <input
                type="number"
                min={0}
                max={59}
                value={calcMins}
                onChange={(e) => setCalcMins(Number(e.target.value))}
                className="bg-navy-900 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-bold"
              />
            </div>
            <div className="lg:col-span-3 bg-white/10 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <div className="text-[10px] uppercase text-coral-400 font-bold">Required Pace</div>
                <div className="font-display font-black text-2xl">{paceResult.pace} /km</div>
                <div className="text-[11px] text-slate-300">{paceResult.corral}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400">Speed</div>
                <div className="font-display font-bold">{paceResult.speed} km/h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Race Kit & Medal Section */}
      <section id="race-kit" className="py-20 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <img
              src="/assets/race-kit-2027.jpg"
              alt="Delhi Dwarka Run 2027 Finisher Medal and Kit"
              className="rounded-3xl border border-white/15 shadow-2xl w-full object-cover"
            />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-display font-bold uppercase text-coral-400">
              🏅 Official 2027 Runner Gear
            </span>
            <h2 className="font-display font-black italic text-3xl sm:text-4xl uppercase">
              3D Finisher Medal, AeroMesh Jersey &amp; Mylaps RFID Bib
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every participant receives our sweat-wicking AeroMesh running jersey, official race
              bib, and heavyweight die-cast finisher medal at the Finish Line Festival.
            </p>
            <button
              onClick={() => handleOpenRegister()}
              className="bg-coral-500 hover:bg-coral-600 text-white font-display font-black uppercase text-xs px-7 py-4 rounded-xl shadow-glow"
            >
              Claim Your 2027 Kit →
            </button>
          </div>
        </div>
      </section>

      {/* Route Map & Event Details Section */}
      <section id="route-map" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-display font-black italic text-3xl sm:text-4xl text-navy-900 uppercase">
              Interactive Route &amp; Elevation Map
            </h2>
            <p className="text-slate-600 mt-2">
              Start &amp; Finish Point:{" "}
              <strong>DDA Sports Complex, Sector 10, Dwarka, New Delhi</strong>
            </p>
            <div className="inline-flex flex-wrap justify-center gap-2 bg-slate-100 p-1.5 rounded-2xl mt-6">
              {(["5k", "10k", "half", "full"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveRouteTab(tab)}
                  className={`px-4 py-2 rounded-xl font-display font-bold text-xs uppercase ${
                    activeRouteTab === tab
                      ? "bg-coral-500 text-white"
                      : "text-slate-600 hover:text-navy-900"
                  }`}
                >
                  {tab} Route
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
            <h3 className="font-display font-extrabold text-2xl text-navy-900">
              {ROUTE_DATA[activeRouteTab].title}
            </h3>
            <p className="text-sm text-slate-600 mt-2">{ROUTE_DATA[activeRouteTab].pathDesc}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 block">Elevation Profile</span>
                <strong>{ROUTE_DATA[activeRouteTab].elevationGain}</strong>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-400 block">Hydration Stations</span>
                <strong>{ROUTE_DATA[activeRouteTab].waterStations}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Leaderboard Section */}
      <section id="results" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-display font-black italic text-3xl text-navy-900 uppercase">
                Results &amp; Registered Runners
              </h2>
              <p className="text-sm text-slate-600">
                Search by Bib # or Runner Name, or filter by race category.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={resultsQuery}
                onChange={(e) => setResultsQuery(e.target.value)}
                placeholder="Search Bib # or Name..."
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
              <select
                value={resultsCategoryFilter}
                onChange={(e) => setResultsCategoryFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
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

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-navy-900 text-white text-xs uppercase font-display">
                  <th className="py-3.5 px-5">Bib #</th>
                  <th className="py-3.5 px-5">Runner Name</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Gender</th>
                  <th className="py-3.5 px-5">Net Time / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredResults.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3.5 px-5 font-mono font-bold text-coral-600">
                      #{row.bib}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-navy-900">{row.name}</td>
                    <td className="py-3.5 px-5">{row.category}</td>
                    <td className="py-3.5 px-5">{row.gender}</td>
                    <td className="py-3.5 px-5 font-mono">{row.netTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-navy-950 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <strong className="text-white font-display">DELHI DWARKA RUN 2027</strong> • Support:{" "}
            <a href="mailto:support@delhidwarkarun.in" className="text-coral-400">
              support@delhidwarkarun.in
            </a>
          </div>
          <div>© 2026–2027 Delhi Dwarka Run Secretariat. All rights reserved.</div>
        </div>
      </footer>

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
