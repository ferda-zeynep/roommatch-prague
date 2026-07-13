"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function MobileLandingPage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans antialiased">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-200">
        <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <header className="px-6 pt-6 flex justify-between items-center z-10">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
              Prague Live
            </span>
          </div>
          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
            v1.0-pwa
          </span>
        </header>

        <main className="flex-1 flex flex-col justify-start pt-8 px-6 text-center space-y-6 z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-[11px] font-bold text-indigo-700 mx-auto">
              ✨ Engineered for Erasmus & Expats
            </div>

            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none pt-1">
              RoomMatch <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
                Prague
              </span>
            </h1>

            <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium leading-relaxed">
              Find verified flatshares, compatible student lifestyles, and
              dynamic flatmate matches close to your faculty.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-xs mx-auto space-y-3 text-left shadow-sm w-full">
            <div className="flex justify-between items-center text-[10px] font-bold text-indigo-600 uppercase">
              <span>📍 Prague 2 (Vinohrady)</span>
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                94% Match
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 truncate">
              Cozy Studio Flat near Náměstí Míru
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-xs font-black text-slate-900">
                15,500 CZK
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                🚇 Metro A reachable
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 max-w-xs w-full mx-auto pt-2">
            <Link
              href="/listings"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-md active:scale-[0.99] text-center block"
            >
              Browse Live Listings
            </Link>

            <Link
              href={isSignedIn ? "/listings" : "/sign-in"}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold py-3.5 rounded-xl transition text-sm active:scale-[0.99] text-center block"
            >
              {isSignedIn ? "Go to App Dashboard" : "Sign In / Register"}
            </Link>
          </div>
        </main>

        <footer className="px-6 pb-6 text-center z-10">
          <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
            &copy; {new Date().getFullYear()} RoomMatch Prague • Built
            Professionally
          </p>
        </footer>
      </div>
    </div>
  );
}
