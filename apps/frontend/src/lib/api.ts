import type { InquiryPayload, ListingResponse, Property } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function getListings(params?: Record<string, string | number | boolean | undefined>) {
  return request<ListingResponse>(buildUrl("/api/listings", params));
}

export async function getListing(slug: string) {
  const response = await request<{ data: Property }>(buildUrl(`/api/listings/${slug}`));
  return response.data;
}

export async function createInquiry(payload: InquiryPayload) {
  return request<{ data: { id: string } }>(buildUrl("/api/inquiries"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function formatPrice(value: number, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function prettyEnum(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}