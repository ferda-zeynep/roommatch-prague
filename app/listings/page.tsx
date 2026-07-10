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
  createdAt: Date;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  nearMetro?: boolean;
}

export default function ListingsPage() {
  const { isSignedIn } = useAuth();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [maxBudget, setMaxBudget] = useState(30000);
  const [sortBy, setSortBy] = useState("newest");

  const [nearMetro, setNearMetro] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);

  const pragueDistricts = [
    "All",
    "Vinohrady",
    "Karlín",
    "Holešovice",
    "Smíchov",
    "Prague 1",
    "Prague 2",
    "Prague 3",
  ];

  useEffect(() => {
    async function loadListings() {
      const data = await getListingsAction();
      const formattedData = data.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),

        isFurnished: item.isFurnished ?? true,
        petsAllowed: item.petsAllowed ?? indexToBool(item.id, 2),
        nearMetro: item.nearMetro ?? indexToBool(item.id, 3),
      }));
      setListings(formattedData);
      setLoading(false);
    }
    loadListings();
  }, []);

  const indexToBool = (id: string, mod: number) =>
    id.charCodeAt(id.length - 1) % mod === 0;

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lifestyle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict =
      selectedDistrict === "All" || item.district === selectedDistrict;
    const matchesBudget = item.rent <= maxBudget;
    const matchesMetro = !nearMetro || item.nearMetro;
    const matchesPets = !petsAllowed || item.petsAllowed;
    const matchesFurnished = !isFurnished || item.isFurnished;

    return (
      matchesSearch &&
      matchesDistrict &&
      matchesBudget &&
      matchesMetro &&
      matchesPets &&
      matchesFurnished
    );
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === "price-low") return a.rent - b.rent;
    if (sortBy === "price-high") return b.rent - a.rent;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-200">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
          <div>
            <span className="text-xs font-bold text-indigo-600 block tracking-wider uppercase">
              Prague Hub
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              RoomMatch
            </h1>
          </div>
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-in"}
            className="text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 px-3 py-1.5 rounded-xl transition"
          >
            {isSignedIn ? "Profile" : "Sign In"}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search rooms, flats, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-9 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              Popular Districts
            </label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {pragueDistricts.map((district) => (
                <button
                  key={district}
                  onClick={() => setSelectedDistrict(district)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                    selectedDistrict === district
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  Max Budget
                </span>
                <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-sm">
                  {maxBudget.toLocaleString()} CZK
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="30000"
                step="1000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
              <button
                onClick={() => setNearMetro(!nearMetro)}
                className={`p-2 rounded-xl text-left border transition text-xs flex items-center justify-between ${
                  nearMetro
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold"
                    : "border-slate-200 text-slate-600 bg-slate-50"
                }`}
              >
                <span>🚇 Near Metro</span>
                <span className="text-[10px]">{nearMetro ? "✕" : "+"}</span>
              </button>
              <button
                onClick={() => setPetsAllowed(!petsAllowed)}
                className={`p-2 rounded-xl text-left border transition text-xs flex items-center justify-between ${
                  petsAllowed
                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold"
                    : "border-slate-200 text-slate-600 bg-slate-50"
                }`}
              >
                <span>🐾 Pets Allowed</span>
                <span className="text-[10px]">{petsAllowed ? "✕" : "+"}</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Results ({sortedListings.length})
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-slate-600 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              <option value="newest">⏰ Newest</option>
              <option value="price-low">💰 Price ↑</option>
              <option value="price-high">💰 Price ↓</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-2xl border border-slate-200 p-3 space-y-3 animate-pulse"
                >
                  <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : sortedListings.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 shadow-sm text-sm">
              <span className="text-3xl block mb-2">✨</span>
              No rooms fit these exact filters.
              <br />
              Try adjusting your budget or district.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedListings.map((listing) => (
                <Link
                  href={`/listings/${listing.id}`}
                  key={listing.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col relative group"
                >
                  <div className="h-36 w-full bg-slate-200 relative">
                    <img
                      src={
                        listing.imageUrl ||
                        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80"
                      }
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-md tracking-wider uppercase">
                      {listing.roomType === "Entire Flat" ? "Flat" : "Room"}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-black text-indigo-600 shadow-sm">
                      {listing.rent} CZK
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
                        {listing.district}
                      </span>
                      <div className="flex gap-1 text-[10px] text-slate-400 font-bold">
                        {listing.nearMetro && <span>🚇 Metro</span>}
                        {listing.petsAllowed && <span>• 🐾 Pets</span>}
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition">
                      {listing.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic line-clamp-1">
                      {listing.lifestyle || "No preferences mentioned"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

        <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-100 h-16 flex justify-around items-center px-4 z-50">
          <button className="flex flex-col items-center gap-1 text-indigo-600 font-bold text-xs">
            <span>🏠</span>
            <span>Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-400 text-xs hover:text-slate-600 transition">
            <span>❤️</span>
            <span>Saved</span>
          </button>
          <Link
            href="/listings/create"
            className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100 hover:bg-indigo-700 transition -translate-y-2"
          >
            +
          </Link>
          <button className="flex flex-col items-center gap-1 text-slate-400 text-xs hover:text-slate-600 transition">
            <span>👤</span>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
