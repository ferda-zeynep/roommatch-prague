"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getListingsAction() {
  try {
    return await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
    });
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
