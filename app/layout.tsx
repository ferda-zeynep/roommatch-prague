"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        >
          {!isOnline && (
            <div className="fixed top-0 inset-x-0 bg-slate-900 text-slate-300 text-[11px] font-bold py-2 px-4 text-center z-50 flex items-center justify-center gap-2 animate-slideDown border-b border-slate-800 backdrop-blur-md bg-opacity-95 max-w-md mx-auto sm:rounded-b-2xl">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Running in offline storage mode. Some features may be restricted.
            </div>
          )}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
