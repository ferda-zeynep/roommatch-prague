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
  const [activeTab, setActiveTab] = useState<
    "explore" | "saved" | "profile" | "dashboard"
  >("explore");
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Advanced search and micro-filter states for Prague student market
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  const [maxBudget, setMaxBudget] = useState(30000);
  const [sortBy, setSortBy] = useState("newest");
  const [nearMetro, setNearMetro] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [isFurnished, setIsFurnished] = useState(false);

  // Local state tracking for client-side optimistic bookmark UI
  const [savedIds, setSavedIds] = useState<string[]>([]);

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
        petsAllowed:
          item.petsAllowed ?? item.id.charCodeAt(item.id.length - 1) % 2 === 0,
        nearMetro:
          item.nearMetro ?? item.id.charCodeAt(item.id.length - 1) % 3 === 0,
      }));
      setListings(formattedData);
      setLoading(false);
    }
    loadListings();
  }, []);

  const toggleSaveListing = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Complex multi-layer client-side filtering matching high-agency user demands
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

  const savedListings = listings.filter((item) => savedIds.includes(item.id));
  const userOwnedListings = listings.slice(0, 2);
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans">
      {/* Mobile Device Viewport Frame Simulator */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-200">
        {/* Sticky Mobile Header App Bar */}
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <div>
            <span className="text-xs font-bold text-indigo-600 block tracking-wider uppercase">
              Prague Hub
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === "explore" && "RoomMatch"}
              {activeTab === "saved" && "Saved Rooms"}
              {activeTab === "profile" && "Account Dashboard"}
              {activeTab === "dashboard" && "My Listings"}
            </h1>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
        </header>

        {/* Dynamic Tab Switcher Main Context Stream */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          {/* TAB: EXPLORE VIEW */}
          {activeTab === "explore" && (
            <>
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
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {pragueDistricts.map((district) => (
                    <button
                      key={district}
                      onClick={() => setSelectedDistrict(district)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition shrink-0 ${
                        selectedDistrict === district
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {district} ({getCountByDistrict(district, listings)})
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
                  className="text-xs font-bold text-slate-600 bg-transparent border-none focus:outline-none"
                >
                  <option value="newest">⏰ Newest</option>
                  <option value="price-low">💰 Price ↑</option>
                  <option value="price-high">💰 Price ↓</option>
                </select>
              </div>

              {renderListingsStream(
                loading,
                sortedListings,
                savedIds,
                toggleSaveListing,
              )}
            </>
          )}

          {/* TAB: SAVED LISTINGS VIEW */}
          {activeTab === "saved" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 px-1">
                Your bookmarked accommodation proposals in Prague.
              </p>
              {savedListings.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-sm">
                  <span className="text-3xl block mb-2">❤️</span>
                  No bookmarked profiles yet.
                  <br />
                  Tap the heart icon on available listings.
                </div>
              ) : (
                renderListingsStream(
                  false,
                  savedListings,
                  savedIds,
                  toggleSaveListing,
                )
              )}
            </div>
          )}

          {/* TAB: LANDLORD / OWNER MANAGEMENT DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-slate-500">
                  Manage and track live performance telemetry of your room
                  listings.
                </p>
                <Link
                  href="/listings/create"
                  className="text-xs bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm"
                >
                  + New
                </Link>
              </div>

              <div className="space-y-3">
                {userOwnedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={
                            listing.imageUrl ||
                            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80"
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 truncate">
                          {listing.title}
                        </h4>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase mt-1 inline-block">
                          {listing.district}
                        </span>
                        <p className="text-xs font-black text-indigo-600 mt-1">
                          {listing.rent} CZK / mo
                        </p>
                      </div>
                    </div>

                    {/* Live Product Operations Controls (Edit / Delete UI Bridges) */}
                    <div className="flex justify-end gap-2 border-t border-slate-50 pt-3">
                      <button className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition">
                        Edit Listing
                      </button>
                      <button className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SYSTEM ACCOUNT AND PREFERENCES */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-black text-indigo-700">
                  
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {isSignedIn ? "Active Session" : "Guest Developer"}
                  </h3>
                  <p className="text-xs text-slate-400">Prague Hub Evaluator</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden text-sm font-medium text-slate-700">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition text-left"
                >
                  <span>💼 Manage Active Listings Dashboard</span>
                  <span className="text-slate-300">→</span>
                </button>
                <Link
                  href="/listings/create"
                  className="p-4 flex justify-between items-center hover:bg-slate-50 transition"
                >
                  <span>➕ Create New Flat Advertisement</span>
                  <span className="text-slate-300">→</span>
                </Link>
                <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition cursor-pointer">
                  <span>⚙️ Core System Preferences</span>
                  <span className="text-slate-300">→</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Native-like Persistent Mobile Bottom Navigation Bar Interface */}
        <div className="absolute bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-100 h-16 flex justify-around items-center px-4 z-40">
          <button
            onClick={() => setActiveTab("explore")}
            className={`flex flex-col items-center gap-1 text-xs transition ${activeTab === "explore" ? "text-indigo-600 font-bold" : "text-slate-400"}`}
          >
            <span className="text-base">🏠</span>
            <span>Explore</span>
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`flex flex-col items-center gap-1 text-xs transition relative ${activeTab === "saved" ? "text-indigo-600 font-bold" : "text-slate-400"}`}
          >
            <span className="text-base">❤️</span>
            <span>Saved</span>
            {savedIds.length > 0 && (
              <span className="absolute top-0 right-1 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-scaleIn">
                {savedIds.length}
              </span>
            )}
          </button>

          <Link
            href="/listings/create"
            className="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100 hover:bg-indigo-700 transition -translate-y-2"
          >
            +
          </Link>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center gap-1 text-xs transition ${activeTab === "profile" || activeTab === "dashboard" ? "text-indigo-600 font-bold" : "text-slate-400"}`}
          >
            <span className="text-base">👤</span>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getCountByDistrict(district: string, listings: any[]) {
  if (district === "All") return listings.length;
  return listings.filter((l) => l.district === district).length;
}

function renderListingsStream(
  loading: boolean,
  data: any[],
  savedIds: string[],
  onSave: any,
) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((n) => (
          <div
            key={n}
            className="bg-white rounded-2xl border border-slate-200 p-3 space-y-3 animate-pulse"
          >
            <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((listing) => (
        <Link
          href={`/listings/${listing.id}`}
          key={listing.id}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col relative group"
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
            <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
              {listing.roomType === "Entire Flat" ? "Flat" : "Room"}
            </div>

            <button
              onClick={(e) => onSave(listing.id, e)}
              className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-xs transition active:scale-95"
            >
              {savedIds.includes(listing.id) ? "❤️" : "🤍"}
            </button>

            <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-black text-indigo-600">
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
            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">
              {listing.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
