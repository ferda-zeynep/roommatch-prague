"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getListingByIdAction, updateListingAction } from "../../actions";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    district: "Prague 2",
    rent: "",
    roomType: "Private Room",
    lifestyle: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;
    async function loadListing() {
      const data = await getListingByIdAction(id);
      if (data) {
        setFormData({
          title: data.title,
          district: data.district,
          rent: String(data.rent),
          roomType: data.roomType,
          lifestyle: data.lifestyle || "",
          description: data.description,
          imageUrl: data.imageUrl || "",
        });
      }
      setLoading(false);
    }
    loadListing();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await updateListingAction(id, {
        title: formData.title,
        district: formData.district,
        rent: HTMLInputElement ? Number(formData.rent) : Number(formData.rent),
        roomType: formData.roomType,
        lifestyle: formData.lifestyle,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
      });

      router.push("/listings");
    } catch (error) {
      console.error(error);
      alert("Failed to update the listing context.");
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start sm:py-8 font-sans">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 relative">
        <header className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-40">
          <button
            onClick={() => router.back()}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
          >
            ← Cancel
          </button>
          <h1 className="text-sm font-black text-slate-900 tracking-tight">
            Modify Advertisement
          </h1>
          <span className="w-4"></span>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 pb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Title
              </label>
              <input
                type="text"
                required
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                  Rent (CZK)
                </label>
                <input
                  type="number"
                  required
                  value={formData.rent}
                  onChange={(e) =>
                    setFormData({ ...formData, rent: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Room Setup
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
                Habits
              </label>
              <input
                type="text"
                value={formData.lifestyle}
                onChange={(e) =>
                  setFormData({ ...formData, lifestyle: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 pl-1">
                Description
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 transition bg-white shadow-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition shadow-md mt-6 text-sm disabled:bg-slate-700 flex items-center justify-center gap-2"
            >
              {submitLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              Save Parameters
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
