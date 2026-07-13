"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createListingAction,
  generateAIDescriptionAction,
  generateAIPriceSuggestionAction,
} from "../actions";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    district: "Vinohrady",
    rent: "",
    roomType: "Private Room",
    lifestyle: "",
    description: "",
    imageUrl: "",
  });

  const handleAIDescription = async () => {
    if (!formData.title) {
      alert("Please fill in the title first to give AI some context!");
      return;
    }
    setAiLoading(true);
    const generatedText = await generateAIDescriptionAction({
      title: formData.title,
      district: formData.district,
      roomType: formData.roomType,
      lifestyle: formData.lifestyle,
    });
    setFormData((prev) => ({ ...prev, description: generatedText || "" }));
    setAiLoading(false);
  };

  const handleAIPriceSuggestion = async () => {
    setPriceLoading(true);
    const suggestion = await generateAIPriceSuggestionAction({
      district: formData.district,
      roomType: formData.roomType,
      lifestyle: formData.lifestyle,
    });
    setPriceSuggestion(suggestion || "");
    setPriceLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createListingAction({
        title: formData.title,
        district: formData.district,
        rent: Number(formData.rent),
        roomType: formData.roomType,
        lifestyle: formData.lifestyle,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/listings");
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Failed to create the listing environment.");
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto animate-bounce">
            ✓
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Listing Published!
          </h2>
          <p className="text-sm text-slate-500">
            Your roommate profile has been securely synchronized with the
            database.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <Link
            href="/listings"
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Cancel
          </Link>
          <h1 className="text-sm font-black text-slate-900 tracking-tight">
            Create Advertisement
          </h1>
          <span className="w-4"></span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Cover Image Link / URL
              </label>
              <input
                type="url"
                placeholder="Paste an image link..."
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
              />

              {formData.imageUrl && (
                <div className="mt-2 relative rounded-2xl overflow-hidden h-32 border border-slate-200 shadow-inner group">
                  <img
                    src={formData.imageUrl}
                    alt="Live asset render snapshot"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Listing Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Cozy Room in Vinohrady near Metro"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                  District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
                >
                  <option value="Vinohrady">Vinohrady</option>
                  <option value="Karlín">Karlín</option>
                  <option value="Holešovice">Holešovice</option>
                  <option value="Smíchov">Smíchov</option>
                  <option value="Prague 1">Prague 1</option>
                  <option value="Prague 2">Prague 2</option>
                  <option value="Prague 3">Prague 3</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 pl-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Rent (CZK)
                  </label>
                  <button
                    type="button"
                    disabled={priceLoading}
                    onClick={handleAIPriceSuggestion}
                    className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded transition"
                  >
                    {priceLoading ? "Evaluating..." : "✨ AI Suggest"}
                  </button>
                </div>
                <input
                  type="number"
                  required
                  placeholder="e.g., 14000"
                  value={formData.rent}
                  onChange={(e) =>
                    setFormData({ ...formData, rent: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
                />
              </div>
            </div>

            {priceSuggestion && (
              <div className="bg-indigo-950 text-indigo-200 rounded-xl p-3 text-xs font-medium border border-indigo-900/50 shadow-inner">
                💡{" "}
                <span className="font-bold text-white">
                  Gemini Market Index:
                </span>{" "}
                {priceSuggestion}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Room Architecture
              </label>
              <select
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
              >
                <option value="Private Room">Private Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Entire Flat">Entire Flat</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Flatmate Habits (Tags)
              </label>
              <input
                type="text"
                placeholder="e.g., Non-smoker, Student, Quiet, Vegan"
                value={formData.lifestyle}
                onChange={(e) =>
                  setFormData({ ...formData, lifestyle: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
              />
            </div>

            <div className="pb-4">
              <div className="flex justify-between items-center mb-1.5 pl-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Detailed Description
                </label>
                <button
                  type="button"
                  disabled={aiLoading}
                  onClick={handleAIDescription}
                  className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-2 py-1 rounded-lg transition flex items-center gap-1 disabled:opacity-50"
                >
                  {aiLoading ? "✨ Generating..." : "✨ Generate with AI"}
                </button>
              </div>
              <textarea
                required
                rows={5}
                placeholder="Provide details about utilities, layout, flatmates, etc..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md text-sm disabled:bg-indigo-400 flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                )}
                Publish Advertisement
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
