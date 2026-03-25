export type DealType = "SALE" | "RENT";
export type PropertyType = "HOUSE" | "CONDO" | "APARTMENT" | "LOT" | "COMMERCIAL";
export type ListingStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type InquiryStatus = "NEW" | "CONTACTED" | "CLOSED";

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  dealType: DealType;
  propertyType: PropertyType;
  status: ListingStatus;
  location: string;
  city: string;
  province?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floorAreaSqm?: number | null;
  lotAreaSqm?: number | null;
  features: string[];
  images: string[];
  videoUrl?: string | null;
  mapEmbedUrl?: string | null;
  agentName?: string | null;
  agentTitle?: string | null;
  agentPhone?: string | null;
  agentEmail?: string | null;
  isFeatured: boolean;
  isLatest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  preferredContact: "EMAIL" | "PHONE" | "SMS" | "WHATSAPP";
  propertyId?: string | null;
  propertyTitle?: string | null;
  status: InquiryStatus;
  createdAt: string;
}