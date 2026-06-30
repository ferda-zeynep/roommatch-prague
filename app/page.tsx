"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* NAVBAR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto rounded-b-xl shadow-sm">
        <Link
          href="/"
          className="text-xl font-bold text-indigo-600 tracking-tight"
        >
          RoomMatch <span className="text-slate-700">Prague</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/listings"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            Browse Listings
          </Link>

          {isSignedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
              >
                Dashboard
              </Link>
              <UserButton />
            </>
          ) : (
            <Link
              href="/sign-in"
              className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
            Find Your Perfect Roommate in{" "}
            <span className="text-indigo-600">Prague</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Connect with students and young professionals relocating to Prague.
            Match by budget, district, and lifestyle choices seamlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/listings"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
            >
              Browse Listings
            </Link>
            <Link
              href="/listings/create"
              className="bg-white border border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium hover:bg-slate-50 transition shadow-sm"
            >
              Create Listing
            </Link>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-left">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 font-bold text-lg">
              ✓
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">
              Verified Profiles
            </h3>
            <p className="text-slate-600 text-sm">
              Secure verification ensures you are browsing and talking to real
              people moving to Prague.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-left">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 font-bold text-lg">
              ⚙
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">
              Smart Filtering
            </h3>
            <p className="text-slate-600 text-sm">
              Filter listings by rent, precise Prague districts, room types, and
              specific habits.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-left">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-4 font-bold text-lg">
              ⚡
            </div>
            <h3 className="text-lg font-bold mb-2 text-slate-800">
              Match Scoring
            </h3>
            <p className="text-slate-600 text-sm">
              See your lifestyle compatibility percentage instantly next to
              every potential listing.
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="bg-indigo-900 text-white rounded-3xl p-12 mt-24 text-center w-full shadow-xl relative overflow-hidden">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to find your next roommate?
          </h2>
          <p className="text-indigo-200 mb-6 max-w-md mx-auto text-sm md:text-base">
            Join our community today and secure your stay in Prague with the
            right flatmate.
          </p>
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-in"}
            className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-md inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 max-w-7xl w-full mx-auto">
        &copy; {new Date().getFullYear()} RoomMatch Prague. All rights reserved.
      </footer>
    </div>
  );
}
