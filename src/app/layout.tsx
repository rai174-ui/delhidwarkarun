import React from "react";
import "./globals.css";

export const metadata = {
  title: "4th Edition Dwarka Half Marathon | Delhi Dwarka Run 2027",
  description:
    "4th Edition of Dwarka Half Marathon (Delhi Dwarka Run 2027) on 14-Feb-2027. Starting Point: Max Hospital, Sector 10, Dwarka, New Delhi. Register for 21.097 KM, 10.5 KM, 5 KM, or 3 KM with 50% Discount till 30-Nov-2026!",
  icons: {
    icon: "/assets/ddr-logo.png?v=3",
    shortcut: "/assets/ddr-logo.png?v=3",
    apple: "/assets/ddr-logo.png?v=3",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/assets/ddr-logo.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/assets/ddr-logo.png?v=3" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/ddr-logo.png?v=3" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:ital,wght@0,700;0,800;0,900;1,800;1,900&family=Teko:wght@600;700&display=swap"
          rel="stylesheet"
        />
        {/* Official Razorpay Standard Checkout SDK */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-slate-50 text-charcoal selection:bg-coral-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
