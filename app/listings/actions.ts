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

export async function getListingByIdAction(id: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            fullName: true,
            clerkId: true,
          },
        },
      },
    });
    return listing;
  } catch (error) {
    console.error("Failed to fetch listing details:", error);
    return null;
  }
}
