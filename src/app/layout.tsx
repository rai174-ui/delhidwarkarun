import React from "react";
import "./globals.css";

export const metadata = {
  title: "Delhi Dwarka Run 2027 | Official Marathon & Registration Portal",
  description:
    "Conquer the Asphalt at Delhi Dwarka Run 2027. Register for Full Marathon (42.2K), Half Marathon (21.1K), 10K Challenge, or 5K Fun Run in Dwarka, New Delhi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-charcoal selection:bg-coral-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
