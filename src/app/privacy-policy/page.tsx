import React from "react";
import {
  PRIVACY_POLICY_SECTIONS,
  DISCLAIMER_TEXT,
  GRIEVANCE_OFFICER,
} from "../../data/legalData";

export const metadata = {
  title: "Privacy Policy | Delhi Dwarka Run 2027 (AMIGOCONNECT.COM)",
  description:
    "Official Privacy Policy and Data Protection Policy for Delhi Dwarka Run 2027, operated by AMIGO CONNECT (AMIGOCONNECT.COM).",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-charcoal flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-xl border-b-2 border-[#29ABE2]/30 text-white py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3.5">
            <div className="h-12 px-2.5 rounded-xl bg-[#C5D887] flex items-center justify-center border-2 border-[#F26522] shadow-glow shrink-0">
              <img
                src="/assets/ddr-logo.png"
                alt="Delhi Dwarka Runners Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-display font-black italic text-base sm:text-lg text-white uppercase">
                DELHI DWARKA <span className="text-coral-500">RUNNERS</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#C5D887]">
                Operated by AMIGO CONNECT (AMIGOCONNECT.COM)
              </div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/terms-and-conditions"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-display font-bold uppercase tracking-wider text-[#C5D887]"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/"
              className="px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-xs font-display font-bold uppercase tracking-wider text-white"
            >
              ← Back to Event Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 space-y-8">
        <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-10 border border-[#29ABE2]/30 shadow-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C5D887]/20 text-[#C5D887] text-xs font-display font-black uppercase tracking-widest mb-3">
            IT Act 2000 &amp; DPDPA 2023 Compliant
          </span>
          <h1 className="font-display font-black italic text-3xl sm:text-5xl uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            DELHI DWARKA RUN (DDR) • Operated by{" "}
            <strong className="text-white">AMIGO CONNECT (AMIGOCONNECT.COM)</strong>
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-8">
          {PRIVACY_POLICY_SECTIONS.map((sec, idx) => (
            <section
              key={idx}
              className="border-b border-slate-100 pb-7 last:border-b-0 last:pb-0 space-y-3"
            >
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-navy-950">
                {idx + 1}. {sec.title}
              </h2>
              {sec.paragraphs?.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="text-sm text-slate-600 leading-relaxed"
                >
                  {p}
                </p>
              ))}
              {sec.bullets && (
                <ul className="space-y-2 pl-5 list-disc text-sm text-slate-600 leading-relaxed">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Grievance Officer Box */}
        <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 border border-[#C5D887]/40 shadow-xl grid md:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <span className="text-xs font-display font-black uppercase tracking-widest text-[#C5D887]">
              Grievance Redressal &amp; User Rights Officer
            </span>
            <h3 className="font-display font-black text-2xl text-white">
              {GRIEVANCE_OFFICER.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              {GRIEVANCE_OFFICER.designation}
            </p>
          </div>
          <div className="space-y-2 text-xs sm:text-sm bg-white/5 p-5 rounded-2xl border border-white/10">
            <div>
              <span className="text-slate-400">Grievance Email: </span>
              <a
                href={`mailto:${GRIEVANCE_OFFICER.email}`}
                className="text-[#C5D887] font-bold underline"
              >
                {GRIEVANCE_OFFICER.email}
              </a>
            </div>
            <div>
              <span className="text-slate-400">Organizer Contact Email: </span>
              <a
                href={`mailto:${GRIEVANCE_OFFICER.primaryEmail}`}
                className="text-coral-400 font-bold underline"
              >
                {GRIEVANCE_OFFICER.primaryEmail}
              </a>
            </div>
            <div>
              <span className="text-slate-400">Official Mobile: </span>
              <a
                href="tel:+919971299631"
                className="text-white font-bold underline"
              >
                {GRIEVANCE_OFFICER.mobile}
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-slate-100 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-2">
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-navy-950">
            Disclaimer
          </h3>
          {DISCLAIMER_TEXT.map((d, i) => (
            <p key={i} className="text-xs text-slate-600 leading-relaxed">
              {d}
            </p>
          ))}
        </div>
      </main>
    </div>
  );
}
