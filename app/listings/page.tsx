"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth, SignOutButton } from "@clerk/nextjs";
import {
  getListingsAction,
  toggleFavoriteAction,
  getUserFavoritesAction,
  deleteListingAction,
} from "./actions";

interface ListingItem {
  id: string;
  title: string;
  district: string;
  rent: number;
  roomType: string;
  lifestyle: string;
  description: string;
  imageUrl?: string | null;
  createdAt: any;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  nearMetro?: boolean;
  [key: string]: any;
}

export const dynamic = "force-dynamic";

export default function ListingsPage() {
  const { isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "explore" | "saved" | "profile" | "dashboard"
  >("explore");
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
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
  const quickSearchTags = [
    "Studio",
    "2+kk",
    "Shared room",
    "Balcony",
    "Furnished",
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    async function initPlatformData() {
      try {
        const [allListings, dbFavorites] = await Promise.all([
          getListingsAction(),
          getUserFavoritesAction(),
        ]);

        console.log("CLIENT:", allListings);
        console.log("CLIENT LENGTH:", allListings ? allListings.length : 0);

        let finalData: any[] = allListings || [];

        if (finalData.length === 0) {
          finalData = [
            {
              id: "mock-1",
              title: "Premium Student Room near Old Town Square",
              district: "Prague 1",
              rent: 16800,
              roomType: "Private Room",
              lifestyle: "Quiet, Student, International",
              description:
                "Stunning flatshare explicitly tailored for incoming Erasmus scholars. 2 minutes walking distance to the faculty nodes.",
              imageUrl:
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
              nearMetro: true,
              petsAllowed: false,
              isFurnished: true,
              createdAt: "2026-07-11T20:00:00.000Z",
              userId: "mock-user-id",
              utilitiesIncluded: true,
              hasBalcony: false,
            },
            {
              id: "mock-2",
              title: "Modern 2+kk Studio Apartment",
              district: "Vinohrady",
              rent: 19500,
              roomType: "Entire Flat",
              lifestyle: "Non-smoker, Professional",
              description:
                "Fully furnished high-end apartment in the heart of Vinohrady. Surrounded by premium cafes, parks, and direct line-A metro links.",
              imageUrl:
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
              nearMetro: true,
              petsAllowed: true,
              isFurnished: true,
              createdAt: "2026-07-11T19:00:00.000Z",
              userId: "mock-user-id",
              utilitiesIncluded: true,
              hasBalcony: true,
            },
            {
              id: "mock-3",
              title: "Cozy Shared Room in Expat Flat",
              district: "Karlín",
              rent: 11000,
              roomType: "Shared Room",
              lifestyle: "Vegan, Social, Creative",
              description:
                "Looking for a friendly roommate to share an absolute gem of an apartment in Karlín. All utilities included in the price loop.",
              imageUrl:
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80",
              nearMetro: false,
              petsAllowed: true,
              isFurnished: true,
              createdAt: "2026-07-11T18:00:00.000Z",
              userId: "mock-user-id",
              utilitiesIncluded: true,
              hasBalcony: false,
            },
          ];
        }

        const formattedData = finalData.map((item: any) => ({
          ...item,
          isFurnished: item.isFurnished ?? true,
          petsAllowed: item.petsAllowed ?? true,
          nearMetro: item.nearMetro ?? true,
        }));

        setListings(formattedData);
        setSavedIds(dbFavorites || []);
      } catch (err) {
        console.error("Init data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    initPlatformData();
  }, []);

  const handleFavoriteToggle = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

    try {
      await toggleFavoriteAction(id);
    } catch (err) {
      setSavedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
      alert("Synchronization warning with cloud infrastructure.");
    }
  };

  const filteredListings = listings.filter((item) => {
    const query = debouncedSearchQuery.toLowerCase();

    const titleText = item.title ? item.title.toLowerCase() : "";
    const lifestyleText = item.lifestyle ? item.lifestyle.toLowerCase() : "";
    const descText = item.description ? item.description.toLowerCase() : "";
    const districtText = item.district ? item.district.toLowerCase() : "";
    const roomText = item.roomType ? item.roomType.toLowerCase() : "";

    const matchesSearch =
      titleText.includes(query) ||
      lifestyleText.includes(query) ||
      descText.includes(query) ||
      districtText.includes(query) ||
      roomText.includes(query);

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
    return (a.id || "").localeCompare(b.id || "");
  });

  const savedListings = listings.filter((item) => savedIds.includes(item.id));
  const userOwnedListings = listings.slice(0, 1);

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-200">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <div>
            <span className="text-xs font-bold text-indigo-600 block tracking-wider uppercase">
              Prague Hub
            </span>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {activeTab === "explore" && "RoomMatch"}
              {activeTab === "saved" && "Saved Rooms"}
              {activeTab === "profile" && "Profile & Settings"}
              {activeTab === "dashboard" && "My Advertisements"}
            </h1>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24">
          {activeTab === "explore" && (
            <>
              <div className="space-y-2">
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
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {quickSearchTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-1 bg-slate-200/60 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-[10px] font-bold rounded-lg transition whitespace-nowrap"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
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

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-50">
                  <button
                    onClick={() => setNearMetro(!nearMetro)}
                    className={`p-2 rounded-xl text-center border transition text-[11px] font-bold ${
                      nearMetro
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 bg-slate-50"
                    }`}
                  >
                    🚇 Metro
                  </button>
                  <button
                    onClick={() => setPetsAllowed(!petsAllowed)}
                    className={`p-2 rounded-xl text-center border transition text-[11px] font-bold ${
                      petsAllowed
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 bg-slate-50"
                    }`}
                  >
                    🐾 Pets
                  </button>
                  <button
                    onClick={() => setIsFurnished(!isFurnished)}
                    className={`p-2 rounded-xl text-center border transition text-[11px] font-bold ${
                      isFurnished
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 bg-slate-50"
                    }`}
                  >
                    📦 Furnished
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
                handleFavoriteToggle,
              )}
            </>
          )}

          {activeTab === "saved" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 px-1">
                Your bookmarked accommodation proposals synced to database
                architecture.
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
                  handleFavoriteToggle,
                )
              )}
            </div>
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-slate-500">
                  Track analytics performance telemetry of your listings.
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

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                      <Link
                        href={`/listings/edit/${listing.id}`}
                        className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition"
                      >
                        Edit Parameters
                      </Link>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you absolutely sure you want to delete this listing node permanently from PostgreSQL?",
                            )
                          ) {
                            try {
                              await deleteListingAction(listing.id);
                              alert("Listing deleted successfully.");
                              window.location.reload();
                            } catch (err) {
                              alert("Failed to drop node asset.");
                            }
                          }
                        }}
                        className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition"
                      >
                        Delete Permanent
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-sm space-y-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                  FZ
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isSignedIn ? "Ferda Zeynep Çapa" : "Guest Account"}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Informatics Student • Prague Hub
                  </p>
                </div>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "Looking for a quiet, study-friendly shared room setup near
                  Vinohrady or Prague 2 loop nodes."
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden text-sm font-bold text-slate-700">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    💼 Manage My Live Listings ({userOwnedListings.length})
                  </span>
                  <span className="text-slate-300 text-xs">→</span>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition text-left"
                >
                  <span className="flex items-center gap-2.5">
                    ❤️ My Favorited Rooms ({savedIds.length})
                  </span>
                  <span className="text-slate-300 text-xs">→</span>
                </button>
                <div className="w-full p-4 flex justify-between items-center hover:bg-slate-50 transition text-left cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    ⚙️ Global Account Settings
                  </span>
                  <span className="text-slate-300 text-xs">→</span>
                </div>
                <div className="w-full p-4 flex justify-between items-center text-rose-600 hover:bg-rose-50/30 transition text-left cursor-pointer">
                  <span className="flex items-center gap-2.5">
                    ❌ Delete Profile Nodes
                  </span>
                  <span className="text-rose-300 text-xs">→</span>
                </div>
              </div>

              <div className="pt-2">
                <SignOutButton>
                  <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-center text-xs shadow-sm tracking-wide uppercase">
                    Logout Secure Session
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}
        </main>

        <div className="fixed bottom-0 sm:bottom-8 w-full max-w-md bg-white/90 backdrop-blur-md border-t border-slate-100 h-16 flex justify-around items-center px-4 z-40 sm:rounded-b-3xl">
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
              <span className="absolute top-0 right-1 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
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
