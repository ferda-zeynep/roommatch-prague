"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ListingDetailPage() {
  const params = useParams();
  const id = params?.id;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-6">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto rounded-xl shadow-sm mb-8">
        <Link
          href="/listings"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          ← Back to All Listings
        </Link>
        <span className="text-xs font-mono text-slate-400">ID: {id}</span>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto bg-white border border-slate-200 p-8 rounded-3xl shadow-sm text-center py-20">
        <div className="text-4xl mb-4">🏠</div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Listing Profile View
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          We are setting up the secure individual information view for this
          specific room profile in Prague.
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          Database Detail Integration Coming Soon
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 max-w-7xl w-full mx-auto mt-8">
        &copy; {new Date().getFullYear()} RoomMatch Prague. All rights reserved.
      </footer>
    </div>
  );
}
