"use server";

import { prisma } from "@/lib/prisma";

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
