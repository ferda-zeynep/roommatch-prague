"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    district: "Prague 2",
    price: "",
    roomType: "Private Room",
    lifestyle: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitted Data: ", formData);
    alert("Listing created successfully! (Mock)");
    router.push("/listings");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* NAVBAR */}
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
            Back to Listings
          </Link>
        </nav>
      </header>

      {/* MAIN FORM */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
            Create a New Listing
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Fill in the details below to find the perfect roommate or room in
            Prague.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Listing Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Beautiful Room near Charles University"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition text-sm bg-slate-50"
              />
            </div>

            {/* DISTRICT & PRICE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prague District
                </label>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition text-sm bg-slate-50"
                >
                  <option value="Prague 1">Prague 1</option>
                  <option value="Prague 2">Prague 2</option>
                  <option value="Prague 3">Prague 3</option>
                  <option value="Prague 4">Prague 4</option>
                  <option value="Prague 5">Prague 5</option>
                  <option value="Prague 6">Prague 6</option>
                  <option value="Prague 7">Prague 7</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Monthly Rent (CZK)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 15000"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition text-sm bg-slate-50"
                />
              </div>
            </div>

            {/* ROOM TYPE */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Room Type
              </label>
              <select
                value={formData.roomType}
                onChange={(e) =>
                  setFormData({ ...formData, roomType: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition text-sm bg-slate-50"
              >
                <option value="Private Room">Private Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Entire Flat">Entire Flat</option>
              </select>
            </div>

            {/* LIFESTYLE / HABITS */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Lifestyle Tags (Habits)
              </label>
              <input
                type="text"
                placeholder="e.g., Non-smoker, Vegan, Quiet, Pet friendly"
                value={formData.lifestyle}
                onChange={(e) =>
                  setFormData({ ...formData, lifestyle: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition text-sm bg-slate-50"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition shadow-md mt-4 text-sm"
            >
              Publish Listing
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 max-w-7xl w-full mx-auto">
        &copy; {new Date().getFullYear()} RoomMatch Prague. All rights reserved.
      </footer>
    </div>
  );
}
