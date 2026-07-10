"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getListingsAction() {
  try {
    const dbListings = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (!dbListings || dbListings.length === 0) {
      return [
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
          createdAt: new Date(),
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
          createdAt: new Date(Date.now() - 3600000),
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
          createdAt: new Date(Date.now() - 7200000),
        },
      ];
    }

    return dbListings;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return [];
  }
}

export async function getListingByIdAction(id: string) {
  try {
    return await prisma.listing.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to fetch listing details:", error);
    return null;
  }
}

export async function createListingAction(formData: {
  title: string;
  district: string;
  rent: number;
  roomType: string;
  lifestyle: string;
  description: string;
  imageUrl?: string | null;
  isFurnished?: boolean;
  petsAllowed?: boolean;
  nearMetro?: boolean;
}) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.listing.create({
      data: {
        title: formData.title,
        district: formData.district,
        rent: formData.rent,
        roomType: formData.roomType,
        lifestyle: formData.lifestyle,
        description: formData.description,
        userId: userId,
        imageUrl: formData.imageUrl || null,
        isFurnished: formData.isFurnished ?? true,
        petsAllowed: formData.petsAllowed ?? true,
        nearMetro: formData.nearMetro ?? true,
      },
    });
    revalidatePath("/listings");
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw error;
  }
}

export async function deleteListingAction(id: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.listing.delete({
      where: { id, userId },
    });
    revalidatePath("/listings");
  } catch (error) {
    console.error("Failed to delete listing:", error);
    throw error;
  }
}

export async function generateAIDescriptionAction(promptData: {
  title: string;
  district: string;
  roomType: string;
  lifestyle: string;
}) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a professional rental description in English for a roommate matching app in Prague based on: Title: ${promptData.title}, District: ${promptData.district}, Room Type: ${promptData.roomType}, Lifestyle: ${promptData.lifestyle}. Keep it short and engaging.`,
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating description with AI.";
  }
}

export async function toggleFavoriteAction(listingId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: userId,
          listingId: listingId,
        },
      },
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: { id: existingFavorite.id },
      });
    } else {
      await prisma.favorite.create({
        data: {
          userId: userId,
          listingId: listingId,
        },
      });
    }

    revalidatePath("/listings");
  } catch (error) {
    console.error("Failed to toggle favorite state:", error);
    throw error;
  }
}

export async function getUserFavoritesAction() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
      select: { listingId: true },
    });

    return favorites.map((fav) => fav.listingId);
  } catch (error) {
    console.error("Failed to fetch user favorites:", error);
    return [];
  }
}

export async function updateListingAction(
  id: string,
  formData: {
    title: string;
    district: string;
    rent: number;
    roomType: string;
    lifestyle: string;
    description: string;
    imageUrl?: string | null;
  },
) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await prisma.listing.update({
      where: { id, userId },
      data: {
        title: formData.title,
        district: formData.district,
        rent: formData.rent,
        roomType: formData.roomType,
        lifestyle: formData.lifestyle,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
      },
    });
    revalidatePath("/listings");
  } catch (error) {
    console.error("Failed to update listing:", error);
    throw error;
  }
}

export async function generateAIPriceSuggestionAction(promptData: {
  district: string;
  roomType: string;
  lifestyle: string;
}) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a Prague real estate expert. Based on District: ${promptData.district}, Room Type: ${promptData.roomType}, and Amenities/Lifestyle: ${promptData.lifestyle}, suggest a realistic monthly rent in CZK (Czech Koruna) as a single number or a tight range. Keep the answer extremely brief, e.g., "14,500 CZK - 16,000 CZK based on district averages."`,
    });
    return response.text || "Unable to calculate dynamic price.";
  } catch (error) {
    console.error("AI Price Suggestion Error:", error);
    return "Error calculating price suggestion.";
  }
}
