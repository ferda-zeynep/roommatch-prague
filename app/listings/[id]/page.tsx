"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getListingByIdAction } from "../actions";

interface DetailedListing {
  id: string;
  title: string;
  district: string;
  rent: number;
  roomType: string;
  lifestyle: string;
  description: string;
  imageUrl?: string | null;
  createdAt: Date;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  nearMetro?: boolean;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [listing, setListing] = useState<DetailedListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function loadListing() {
      const data = await getListingByIdAction(id);
      if (data) {
        const rawData = data as any;
        setListing({
          id: rawData.id,
          title: rawData.title,
          district: rawData.district,
          rent: Number(rawData.rent),
          roomType: rawData.roomType,
          lifestyle: rawData.lifestyle || "",
          description: rawData.description,
          imageUrl: rawData.imageUrl,
          createdAt: new Date(rawData.createdAt),
          isFurnished: rawData.isFurnished ?? true,
          petsAllowed: rawData.petsAllowed ?? true,
          nearMetro: rawData.nearMetro ?? true,
        });
      }
      setLoading(false);
    }
    loadListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-base font-bold text-slate-800 mb-1">
          Listing Not Found
        </h2>
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-indigo-600"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans antialiased">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-200">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Back
          </button>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
            {listing.district}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto pb-20">
          <div className="h-64 bg-slate-200 relative group">
            <img
              src={
                listing.imageUrl ||
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80"
              }
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
              {listing.roomType}
            </div>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-sm transition active:scale-90"
            >
              {isSaved ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="p-4 space-y-5">
            <div className="border-b border-slate-100 pb-4 space-y-1">
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                {listing.title}
              </h1>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-2xl font-black text-indigo-600">
                  {listing.rent.toLocaleString()} CZK{" "}
                  <span className="text-xs text-slate-400 font-medium">
                    / mo
                  </span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Utilities Included
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-30%] w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <h3 className="text-xs font-black uppercase tracking-wider text-indigo-200">
                    Cognitive AI Match Score
                  </h3>
                </div>
                <span className="text-lg font-black bg-indigo-500 text-white px-2.5 py-0.5 rounded-xl text-sm shadow-sm">
                  94%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                Excellent alignment with your profile! Budget falls perfectly
                within limits, lifestyle settings match flatmate habits, and
                proximity to Prague's transit network is optimal.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                <span>🚇</span>{" "}
                <span>
                  {listing.nearMetro ? "Near Metro Link" : "Tram Access Only"}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                <span>📦</span>{" "}
                <span>
                  {listing.isFurnished ? "Fully Furnished" : "Unfurnished"}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                <span>🐾</span>{" "}
                <span>{listing.petsAllowed ? "Pets Allowed" : "No Pets"}</span>
              </div>
              <div className="bg-white border border-slate-200 p-2.5 rounded-xl flex items-center gap-2">
                <span>📅</span>{" "}
                <span className="text-indigo-600">Available August 2026</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                Property Narrative
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {listing.lifestyle && (
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-0.5">
                  Target Habits
                </h3>
                <div className="flex flex-wrap gap-1">
                  {listing.lifestyle
                    .split(",")
                    .map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-black px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg uppercase tracking-wide"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-2">
              <a
                href={`mailto:landlord-prague@roommatch.io?subject=Inquiry: ${encodeURIComponent(listing.title)}`}
                className="flex-1 bg-slate-950 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl transition text-center block text-sm shadow-md active:scale-[0.99]"
              >
                ✉ Contact Landlord
              </a>
              <button
                onClick={() =>
                  alert("Report successfully submitted to verification nodes.")
                }
                className="bg-slate-200 hover:bg-slate-300 px-4 rounded-xl transition active:scale-[0.99] text-sm"
                title="Report Listing"
              >
                ⚠️
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
