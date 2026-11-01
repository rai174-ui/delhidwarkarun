"use client";

import React, { useState, useMemo } from "react";

interface FullRegistrationRecord {
  id: string;
  bib: string;
  registeredAt: string;
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  tshirtSize: string;
  emergencyName: string;
  emergencyPhone: string;
  categoryId: string;
  categoryName: string;
  distance: string;
  startTime: string;
  originalFee: number;
  discountAmount: number;
  amountPaid: number;
  couponCode: string;
  paymentId: string;
  orderId: string;
  paymentMode: string;
  paymentStatus: string;
}

export default function AdminRegistrationsPage() {
  const [passcode, setPasscode] = useState("DDR2027ADMIN");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [records, setRecords] = useState<FullRegistrationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");

  const fetchAdminRegistrations = async (codeToUse = passcode) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/registrations?mode=admin&passcode=${encodeURIComponent(codeToUse)}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unauthorized or failed to load records.");
      }

      // Also merge any local browser backup records if present
      let merged: FullRegistrationRecord[] = data.registrations || [];
      if (typeof window !== "undefined") {
        try {
          const localRaw = localStorage.getItem("ddr2027_registrations_backup");
          if (localRaw) {
            const localList: FullRegistrationRecord[] = JSON.parse(localRaw);
            const existingIds = new Set(merged.map((r) => r.id));
            for (const item of localList) {
              if (item && item.id && !existingIds.has(item.id)) {
                merged.push(item);
              }
            }
          }
        } catch {}
      }

      setRecords(merged);
      setAuthenticated(true);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch registrations.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.fullName.toLowerCase().includes(q) ||
        r.bib.toLowerCase().includes(q) ||
        r.mobile.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.paymentId.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "All" || r.categoryName === categoryFilter;
      const matchesSize = sizeFilter === "All" || r.tshirtSize === sizeFilter;
      return matchesSearch && matchesCat && matchesSize;
    });
  }, [records, searchQuery, categoryFilter, sizeFilter]);

  const totalRevenue = useMemo(
    () => filteredRecords.reduce((sum, r) => sum + (Number(r.amountPaid) || 0), 0),
    [filteredRecords]
  );

  const tshirtCounts = useMemo(() => {
    const counts: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    for (const r of filteredRecords) {
      if (counts[r.tshirtSize] !== undefined) {
        counts[r.tshirtSize]++;
      }
    }
    return counts;
  }, [filteredRecords]);

  const handleDownloadCSV = () => {
    window.open(
      `/api/registrations?format=csv&passcode=${encodeURIComponent(passcode)}`,
      "_blank"
    );
  };

  const handleDownloadJSON = () => {
    const blob = new Blob([JSON.stringify(filteredRecords, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `delhi-dwarka-run-2027-registrations-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-charcoal flex flex-col">
      {/* Top Bar */}
      <header className="bg-navy-950 text-white border-b-2 border-[#29ABE2]/30 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src="/assets/ddr-logo.png"
              alt="Delhi Dwarka Runners Logo"
              className="h-11 w-auto rounded-xl bg-[#C5D887] px-2 py-1 object-contain border border-[#F26522] shrink-0"
            />
            <div>
              <h1 className="font-display font-black text-lg uppercase tracking-tight">
                Delhi Dwarka Run 2027 — Organizer Registration Database
              </h1>
              <p className="text-xs text-[#C5D887]">
                4th Edition Dwarka Half Marathon (14-Feb-2027) • Helpdesk: padam@amigoconnect.com • +91 99712 99631
              </p>
            </div>
          </div>

          <a
            href="/"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-display font-bold uppercase tracking-wider"
          >
            ← Back to Event Website
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {!authenticated ? (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-card mt-10">
            <span className="px-3 py-1 rounded-full bg-coral-500/10 text-coral-600 text-xs font-display font-bold uppercase">
              Organizer Access
            </span>
            <h2 className="font-display font-black text-2xl text-navy-950 mt-2">
              View &amp; Export All Registrations
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter the Organizer Passcode to view all runner personal details, emergency contacts,
              T-shirt sizes, and Razorpay payment IDs. (Default passcode:{" "}
              <code className="font-mono font-bold text-navy-900">DDR2027ADMIN</code>)
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold">
                {error}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchAdminRegistrations(passcode);
              }}
              className="mt-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Admin Passcode
                </label>
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-mono"
                  placeholder="Enter Admin Passcode"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coral-500 hover:bg-coral-600 text-white font-display font-black uppercase text-xs tracking-wider py-4 rounded-xl shadow-glow"
              >
                {loading ? "Loading Registrations..." : "Unlock Registration Records →"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Analytics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-display font-bold uppercase text-slate-400">
                  Total Registered Runners
                </div>
                <div className="font-display font-black text-4xl text-navy-950 mt-1">
                  {filteredRecords.length}
                </div>
                <div className="text-xs text-emerald-600 font-semibold mt-1">
                  All details stored &amp; exportable
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-display font-bold uppercase text-slate-400">
                  Total Revenue Collected
                </div>
                <div className="font-display font-black text-4xl text-emerald-600 mt-1">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Net of 50% Early Bird Discount
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="text-xs font-display font-bold uppercase text-slate-400">
                  T-Shirt Size Inventory
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-navy-950 mt-3">
                  <span>S: {tshirtCounts.S}</span>
                  <span>M: {tshirtCounts.M}</span>
                  <span>L: {tshirtCounts.L}</span>
                  <span>XL: {tshirtCounts.XL}</span>
                  <span>XXL: {tshirtCounts.XXL}</span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Dry-Fit Kit Distribution Count
                </div>
              </div>

              <div className="bg-navy-950 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div className="text-xs font-display font-bold uppercase text-volt">
                  Export All Data
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={handleDownloadCSV}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-navy-950 font-display font-black text-xs uppercase py-2.5 px-4 rounded-xl transition-colors"
                  >
                    📥 Download Excel CSV (.csv)
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-display font-bold text-xs uppercase py-2 px-4 rounded-xl transition-colors"
                  >
                    📄 Download JSON Backup
                  </button>
                </div>
              </div>
            </div>

            {/* Filter & Search Controls */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Name, Bib #, Mobile, Email, Payment ID..."
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm flex-1 min-w-[240px]"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-semibold"
                >
                  <option value="All">All 4 Categories</option>
                  <option value="Half Marathon (21.097 KM)">Half Marathon (21.097 KM)</option>
                  <option value="10.5 KM Challenge">10.5 KM Challenge</option>
                  <option value="5 KM Run">5 KM Run</option>
                  <option value="3 KM Fun Run / Walk">3 KM Fun Run / Walk</option>
                </select>
                <select
                  value={sizeFilter}
                  onChange={(e) => setSizeFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white font-semibold"
                >
                  <option value="All">All Tee Sizes</option>
                  <option value="S">Size S</option>
                  <option value="M">Size M</option>
                  <option value="L">Size L</option>
                  <option value="XL">Size XL</option>
                  <option value="XXL">Size XXL</option>
                </select>
              </div>

              <button
                onClick={() => fetchAdminRegistrations(passcode)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-display font-bold uppercase text-navy-950"
              >
                🔄 Refresh List
              </button>
            </div>

            {/* Complete Registrations Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-navy-950 text-white uppercase font-display tracking-wider">
                      <th className="py-4 px-4">Bib #</th>
                      <th className="py-4 px-4">Date &amp; Time</th>
                      <th className="py-4 px-4">Full Name</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Mobile &amp; Email</th>
                      <th className="py-4 px-4">DOB / Gender / Blood</th>
                      <th className="py-4 px-4">Tee Size</th>
                      <th className="py-4 px-4">Emergency Contact</th>
                      <th className="py-4 px-4">Amount Paid</th>
                      <th className="py-4 px-4">Payment / Order ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRecords.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-500 text-sm">
                          No registrations recorded yet. Completed registrations will appear here
                          automatically with full runner details.
                        </td>
                      </tr>
                    ) : (
                      filteredRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="py-3.5 px-4 font-mono font-bold text-coral-600 text-sm">
                            #{r.bib}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                            {new Date(r.registeredAt).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-navy-950 text-sm">
                            {r.fullName}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-navy-900">
                            {r.categoryName}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-navy-950">{r.mobile}</div>
                            <div className="text-slate-500">{r.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div>DOB: {r.dob || "—"}</div>
                            <div className="text-slate-500">
                              {r.gender} • Blood: {r.bloodGroup || "O+"}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-navy-900 text-white font-display font-bold">
                              {r.tshirtSize}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-navy-900">{r.emergencyName}</div>
                            <div className="font-mono text-slate-500">{r.emergencyPhone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-display font-black text-emerald-600 text-sm">
                              ₹{r.amountPaid}
                            </div>
                            <div className="text-[10px] text-slate-400 line-through">
                              ₹{r.originalFee}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="text-navy-900 font-bold">{r.paymentId}</div>
                            {r.orderId && <div className="text-slate-400">{r.orderId}</div>}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
