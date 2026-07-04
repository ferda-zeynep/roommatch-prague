"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getListingsAction } from "./actions";

interface ListingItem {
  id: string;
  title: string;
  district: string;
  rent: number;
  roomType: string;
  lifestyle: string;
  imageUrl?: string | null;
}

export default function ListingsPage() {
  const { isSignedIn } = useAuth();
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      const data = await getListingsAction();
      setListings(data);
      setLoading(false);
    }
    loadListings();
  }, []);

  const filteredListings =
    selectedDistrict === "All"
      ? listings
      : listings.filter((l) => l.district === selectedDistrict);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto rounded-b-xl shadow-sm">
        <Link
          href="/"
          className="text-xl font-bold text-indigo-600 tracking-tight"
        >
          RoomMatch <span className="text-slate-700">Prague</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-in"}
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition"
          >
            {isSignedIn ? "Dashboard" : "Sign In"}
          </Link>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Available Rooms & Roommates
            </h1>
            <p className="text-slate-600">
              Find accommodation and compatible flatmates across Prague's best
              districts.
            </p>
          </div>
          {!loading && (
            <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl text-sm font-medium text-indigo-700 self-start md:self-auto">
              Total Found:{" "}
              <span className="font-bold">{filteredListings.length}</span>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <span className="text-sm font-semibold text-slate-700">
            Filter by District:
          </span>
          {["All", "Prague 1", "Prague 2", "Prague 3", "Prague 7"].map(
            (district) => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  selectedDistrict === district
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {district}
              </button>
            ),
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500">
            Loading listings...
          </div>
        ) : filteredListings.length === 0 ? (
          /* YENİ DOKUNUŞ: Boş sayfaya buton ekledik */
          <div className="text-center py-16 text-slate-500 bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col items-center justify-center p-8">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No active listings yet
            </h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Be the first one to share a room or find a roommate in Prague!
            </p>
            <Link
              href="/listings/create"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-md"
            >
              + Create First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="h-48 w-full relative bg-slate-200">
                  <img
                    src={
                      listing.imageUrl ||
                      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80"
                    }
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md">
                        {listing.district}
                      </span>
                      <span className="text-xs text-slate-500">
                        {listing.roomType}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mb-2 line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 italic">
                      {listing.lifestyle || "No specific lifestyle tags"}
                    </p>
                  </div>
                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <div>
                      <span className="text-lg font-extrabold text-indigo-600">
                        {listing.rent} CZK
                      </span>
                      <span className="text-xs text-slate-500"> / month</span>
                    </div>
                    <Link
                      href={`/listings/${listing.id}`}
                      className="text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 px-3 py-2 rounded-lg transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 max-w-7xl w-full mx-auto">
        &copy; {new Date().getFullYear()} RoomMatch Prague. All rights reserved.
      </footer>
    </div>
  );
}
