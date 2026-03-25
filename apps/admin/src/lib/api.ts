import type { Inquiry, ListingStatus, Property } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE}${path}`, window.location.origin);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
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

export async function getListings() {
  const response = await request<{ data: Property[] }>(buildUrl("/api/listings", { pageSize: 100 }));
  return response.data;
}

export async function createListing(payload: Record<string, unknown>) {
  const response = await request<{ data: Property }>(buildUrl("/api/listings"), {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function updateListing(id: string, payload: Record<string, unknown>) {
  const response = await request<{ data: Property }>(buildUrl(`/api/listings/${id}`), {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function deleteListing(id: string) {
  await request<void>(buildUrl(`/api/listings/${id}`), {
    method: "DELETE"
  });
}

export async function updateListingStatus(id: string, status: ListingStatus) {
  const response = await request<{ data: Property }>(buildUrl(`/api/listings/${id}/status`), {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
  return response.data;
}

export async function getInquiries() {
  const response = await request<{ data: Inquiry[] }>(buildUrl("/api/inquiries"));
  return response.data;
}

export async function updateInquiryStatus(id: string, status: Inquiry["status"]) {
  const response = await request<{ data: Inquiry }>(buildUrl(`/api/inquiries/${id}/status`), {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
  return response.data;
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