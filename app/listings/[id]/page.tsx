"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getListingByIdAction } from "../actions";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadListing() {
      const data = await getListingByIdAction(id);
      setListing(data);
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
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden relative border border-slate-200">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Back
          </button>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
            {listing.district}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto pb-12">
          <div className="h-56 bg-slate-200 relative">
            <img
              src={
                listing.imageUrl ||
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80"
              }
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
              {listing.roomType}
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h1 className="text-lg font-black text-slate-900 leading-tight mb-2">
                {listing.title}
              </h1>
              <div className="text-xl font-black text-indigo-600">
                {listing.rent} CZK{" "}
                <span className="text-xs text-slate-400 font-medium">
                  / month
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {listing.lifestyle && (
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Lifestyle Preferences
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {listing.lifestyle
                    .split(",")
                    .map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2.5 py-1 bg-slate-200/70 text-slate-600 rounded-md"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <a
                href={`mailto:support@roommatch-prague.com?subject=Inquiry: ${encodeURIComponent(listing.title)}`}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-center block text-sm shadow-sm"
              >
                ✉ Contact Flat Owner
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
