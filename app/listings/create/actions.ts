"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getListingsAction() {
  try {
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return listings;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return [];
  }
}

export async function getListingByIdAction(id: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
    });
    return listing;
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
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized! You must be logged in.");
    }

    await prisma.listing.create({
      data: {
        title: formData.title,
        district: formData.district,
        rent: formData.rent,
        roomType: formData.roomType,
        lifestyle: formData.lifestyle,
        description: formData.description,
        userId: userId,
      },
    });

    revalidatePath("/listings");
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw new Error("Could not save listing to database.");
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
      contents: `Generate a professional, catchy, and well-structured real estate rental description in English for a roommate matching app in Prague based on these details:
      - Title: ${promptData.title}
      - District: ${promptData.district}
      - Room Type: ${promptData.roomType}
      - Ideal Flatmate Lifestyle: ${promptData.lifestyle}
      
      Keep it realistic, engaging for students or expats moving to Prague, and format it with short clean paragraphs. Do not use markdown titles.`,
    });

    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    return "Error generating description with AI.";
  }
}
