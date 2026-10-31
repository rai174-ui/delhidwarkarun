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
  const [selectedCategory, setSelectedCategory] = useState<RaceCategory>(
    RACE_CATEGORIES[1]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRouteTab, setActiveRouteTab] = useState<RaceCategory["id"]>("half");
  const [resultsQuery, setResultsQuery] = useState("");
  const [resultsCategoryFilter, setResultsCategoryFilter] = useState("All");
  const [registrations, setRegistrations] = useState<RunnerResult[]>([]);
  const [contactSubmitted, setContactSubmitted] = useState(false);

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
      {/* Sticky Header / Navbar */}
      <header className="sticky top-0 z-40 bg-navy-900/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-coral-500 to-orange-600 flex items-center justify-center shadow-glow font-display font-black">
              DDR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-white">
                  DELHI DWARKA
                </span>
                <span className="font-display font-black text-lg sm:text-xl tracking-tight text-coral-500">
                  RUN 2027
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 -mt-1">
                2027 Championship Edition • New Delhi
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-200">
            <a href="#home" className="hover:text-coral-400 transition-colors">
              Home
            </a>
            <a href="#categories" className="hover:text-coral-400 transition-colors">
              Categories
            </a>
            <a href="#route-map" className="hover:text-coral-400 transition-colors">
              Route Map
            </a>
            <a href="#about" className="hover:text-coral-400 transition-colors">
              About
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
              className="bg-coral-500 hover:bg-coral-600 text-white font-display font-bold text-sm px-6 py-3 rounded-xl shadow-glow transition-all"
            >
              Register Now
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
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Home
              </a>
              <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Categories
              </a>
              <a href="#route-map" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                Route Map
              </a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2">
                About
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

      {/* Hero Section */}
      <section id="home" className="relative bg-navy-950 text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15">
                <span className="text-xs font-bold uppercase tracking-wider text-coral-400">
                  Sunday, February 21, 2027
                </span>
                <span className="text-white/30">•</span>
                <span className="text-xs font-medium text-slate-200">
                  Dwarka Sector 10 Sports Complex, New Delhi
                </span>
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight">
                Conquer the Asphalt:{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-coral-500 to-amber-400">
                  Delhi Dwarka Run 2027
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
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
                  className="bg-coral-500 hover:bg-coral-600 text-white font-display font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-glow transition-all"
                >
                  Register Your Spot →
                </button>
              </div>
            </div>

            {/* Right Interactive Selector */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-3">
                <h2 className="font-display font-extrabold text-xl text-white mb-2">
                  Choose Your Distance
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
                          : "bg-navy-900/70 text-white border-white/10 hover:bg-navy-800/80"
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
                            Start: {cat.startTime} • {cat.tagline}
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
                  className="w-full bg-coral-500 hover:bg-coral-600 text-white font-display font-bold py-4 rounded-xl shadow-glow mt-3"
                >
                  Register for {selectedCategory.name} (₹{selectedCategory.fee})
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
            <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900">
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
                  <div className={`bg-gradient-to-r ${cat.color} p-6 text-white`}>
                    <div className="font-display font-black text-4xl">{cat.distance}</div>
                    <h3 className="font-display font-bold text-lg mt-1">{cat.name}</h3>
                    <p className="text-xs text-white/85 mt-1">{cat.tagline}</p>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-600">{cat.description}</p>
                    <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between">
                      <span>Start: <strong>{cat.startTime}</strong></span>
                      <span>Cut-off: <strong>{cat.cutoffTime}</strong></span>
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
                    <span className="text-xs text-slate-400">Entry Fee</span>
                    <span className="font-display font-black text-2xl text-navy-900">
                      ₹{cat.fee}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenRegister(cat)}
                    className="w-full py-3.5 px-5 rounded-xl bg-navy-900 hover:bg-coral-500 text-white font-display font-bold text-sm transition-colors"
                  >
                    Register for {cat.distance}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Route Map & Event Details Section */}
      <section id="route-map" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-navy-900">
              Event Details &amp; Interactive Route Map
            </h2>
            <p className="text-slate-600 mt-2">
              Start &amp; Finish Point: <strong>DDA Sports Complex, Sector 10, Dwarka, New Delhi</strong>
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
              <h2 className="font-display font-black text-3xl text-navy-900">
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
