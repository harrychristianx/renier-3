export type DealType = "SALE" | "RENT";
export type PropertyType = "HOUSE" | "CONDO" | "APARTMENT" | "LOT" | "COMMERCIAL";
export type ListingStatus = "AVAILABLE" | "RESERVED" | "SOLD";

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

export interface ListingMeta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface ListingResponse {
  data: Property[];
  meta: ListingMeta;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredContact: "EMAIL" | "PHONE" | "SMS" | "WHATSAPP";
  propertyId?: string;
  propertyTitle?: string;
}