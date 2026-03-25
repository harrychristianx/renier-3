import { Property } from "@renier/db";

function jsonStringArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .map((value) => (typeof value === "string" ? value : ""))
      .filter(Boolean);
  }

  return [];
}

export function serializeProperty(property: Property) {
  return {
    ...property,
    features: jsonStringArray(property.features),
    images: jsonStringArray(property.images)
  };
}