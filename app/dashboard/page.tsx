"use client";

import Link from "next/link";
import { useUser, SignOutButton } from "@clerk/nextjs";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* DASHBOARD NAVBAR */}
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
          <SignOutButton>
            <button className="text-sm font-medium text-red-600 hover:text-red-700 transition">
              Sign Out
            </button>
          </SignOutButton>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl w-full mx-auto px-6 py-12">
        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-900 text-white rounded-3xl p-8 shadow-lg mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            Welcome back, {user?.firstName || "RoomMatcher"}! 👋
          </h1>
          <p className="text-indigo-100 text-sm md:text-base max-w-xl">
            Manage your listings, update your roommate preferences, and view
            your compatibility matches in Prague.
          </p>
        </div>

        {/* QUICK STATS & LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: USER PROFILE SUMMARY */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
            <img
              src={user?.imageUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-indigo-100 mb-4 shadow-sm"
            />
            <h2 className="text-xl font-bold text-slate-800">
              {user?.fullName}
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
            <div className="w-full border-t border-slate-100 pt-4 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                ● Account Active
              </span>
            </div>
          </div>

          {/* RIGHT: MY LISTINGS & ACTIONS */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                My Roommate Listings
              </h3>
              <Link
                href="/listings/create"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
              >
                + Create New Listing
              </Link>
            </div>

            {/* EMPTY STATE (Kullanıcının henüz ilanı yoksa) */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h4 className="text-base font-semibold text-slate-700 mb-1">
                No active listings yet
              </h4>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-4">
                Create a listing to let potential roommates in Prague know about
                your budget, preferred districts, and lifestyle!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
