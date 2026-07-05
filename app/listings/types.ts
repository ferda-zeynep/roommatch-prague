export interface ListingItem {
  id: string;
  title: string;
  district: string;
  rent: number;
  roomType: string;
  lifestyle: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
