const API_BASE = import.meta.env.VITE_API_URL ?? "";
function buildUrl(path, params) {
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
async function request(input, init) {
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
        return undefined;
    }
    return (await response.json());
}
export async function getListings(params) {
    return request(buildUrl("/api/listings", params));
}
export async function getListing(slug) {
    const response = await request(buildUrl(`/api/listings/${slug}`));
    return response.data;
}
export async function createInquiry(payload) {
    return request(buildUrl("/api/inquiries"), {
        method: "POST",
        body: JSON.stringify(payload)
    });
}
export function formatPrice(value, currency = "PHP") {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
    }).format(value);
}
export function prettyEnum(value) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}
