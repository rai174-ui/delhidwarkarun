import React from "react";
import "./globals.css";

export const metadata = {
  title: "Delhi Dwarka Run 2027 | Premier Marathon & Registration Portal",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,700;0,800;0,900;1,800;1,900&family=Teko:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-charcoal selection:bg-coral-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
