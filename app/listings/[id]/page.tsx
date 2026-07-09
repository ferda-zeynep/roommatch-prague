"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getListingByIdAction } from "../actions";

export default function ListingDetailPage() {
  const params = useParams();
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Listing Not Found
        </h2>
        <p className="text-slate-500 text-sm mb-4">
          The flat profile you are looking for does not exist or has been
          removed.
        </p>
        <Link
          href="/listings"
          className="text-sm font-semibold text-indigo-600 hover:underline"
        >
          ← Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center max-w-7xl w-full mx-auto rounded-b-xl shadow-sm">
        <Link
          href="/listings"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          ← Back to All Listings
        </Link>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md uppercase">
          {listing.district}
        </span>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="h-64 sm:h-96 bg-slate-200 relative">
            <img
              src={
                listing.imageUrl ||
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
              }
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-100 pb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="font-semibold text-indigo-600">
                    {listing.roomType}
                  </span>
                  <span>•</span>
                  <span>
                    Posted by {listing.user?.fullName || "RoomMatcher"}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-3xl font-black text-indigo-600 block">
                  {listing.rent} CZK
                </span>
                <span className="text-xs text-slate-400">
                  per month (utilities incl.)
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Description
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {listing.lifestyle && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Lifestyle Preferences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.lifestyle
                    .split(",")
                    .map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="text-xs font-medium px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <a
                href={`mailto:support@roommatch-prague.com?subject=Inquiry regarding: ${encodeURIComponent(listing.title)}`}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition shadow-md flex items-center justify-center text-sm gap-2"
              >
                ✉ Contact Listing Owner
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 max-w-7xl w-full mx-auto">
        &copy; {new Date().getFullYear()} RoomMatch Prague. All rights reserved.
      </footer>
    </div>
  );
}
