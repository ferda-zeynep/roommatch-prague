"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function MobileLandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex justify-center items-start sm:py-8 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Premium Unified Mobile Viewport Frame */}
      <div className="w-full max-w-md bg-slate-950 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-800/80 shadow-indigo-500/10">
        {/* Background Visual Gradients */}
        <div className="absolute top-[-20%] left-[-20%] w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Minimal Bar */}
        <header className="px-6 pt-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
              Prague Live
            </span>
          </div>
          <span className="text-[10px] font-bold bg-slate-800/80 backdrop-blur-md text-indigo-400 px-2.5 py-1 rounded-full border border-slate-700/50">
            v1.0-pwa
          </span>
        </header>

        {/* Core Hero Branding Area */}
        <main className="flex-1 flex flex-col justify-center px-6 text-center space-y-8 z-10 my-auto">
          <div className="space-y-3">
            {/* Soft Premium Micro-Badge */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-[11px] font-semibold text-indigo-300 mx-auto">
              ✨ Engineered for Erasmus & Expats
            </div>

            <h1 className="text-4xl font-black text-white tracking-tight leading-none pt-2">
              RoomMatch <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
                Prague
              </span>
            </h1>

            <p className="text-slate-400 text-sm max-w-xs mx-auto font-medium leading-relaxed">
              Find verified flatshares, compatible student lifestyles, and
              dynamic flatmate matches close to your faculty.
            </p>
          </div>

          {/* Premium UI Mockup Elements inside Landing */}
          <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 max-w-xs mx-auto space-y-3 text-left shadow-xl shadow-black/40">
            <div className="flex justify-between items-center text-[10px] font-bold text-indigo-400 uppercase">
              <span>📍 Prague 2 (Vinohrady)</span>
              <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                94% Match
              </span>
            </div>
            <div className="text-xs font-bold text-white truncate">
              Cozy Studio Flat near Náměstí Míru
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-800/60">
              <span className="text-xs font-black text-white">15,500 CZK</span>
              <span className="text-[9px] text-slate-500 font-medium">
                🚇 Metro A reachable
              </span>
            </div>
          </div>

          {/* Call To Actions */}
          <div className="flex flex-col gap-3 max-w-xs w-full mx-auto pt-4">
            <Link
              href="/listings"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-indigo-950/50 active:scale-[0.99] text-center block"
            >
              Browse Live Listings
            </Link>

            <Link
              href={isSignedIn ? "/listings" : "/sign-in"}
              className="w-full bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 border border-slate-800 font-bold py-3.5 rounded-xl transition text-sm active:scale-[0.99] text-center block backdrop-blur-md"
            >
              {isSignedIn ? "Go to App Dashboard" : "Sign In / Register"}
            </Link>
          </div>
        </main>

        {/* Minimal Mobile-first Footer */}
        <footer className="px-6 pb-6 text-center z-10">
          <p className="text-[10px] text-slate-600 font-semibold tracking-wide uppercase">
            &copy; {new Date().getFullYear()} RoomMatch Prague • Built
            Professionally
          </p>
        </footer>
      </div>
    </div>
  );
}
