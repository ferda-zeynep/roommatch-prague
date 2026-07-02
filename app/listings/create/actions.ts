"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createListingAction(formData: {
  title: string;
  district: string;
  rent: number;
  roomType: string;
  lifestyle: string;
  description: string;
}) {
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
}
