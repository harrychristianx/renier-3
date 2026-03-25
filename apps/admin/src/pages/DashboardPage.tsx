import { FormEvent, useMemo, useState } from "react";
import {
  createListing,
  deleteListing,
  formatPrice,
  getInquiries,
  getListings,
  prettyEnum,
  updateInquiryStatus,
  updateListing,
  updateListingStatus
} from "../lib/api";
import type { Inquiry, ListingStatus, Property } from "../lib/types";
import { useEffect } from "react";

const EMPTY_FORM = {
  id: "",
  title: "",
  slug: "",
  description: "",
  price: "",
  currency: "PHP",
  dealType: "SALE",
  propertyType: "HOUSE",
  status: "AVAILABLE",
  location: "",
  city: "",
  province: "",
  bedrooms: "",
  bathrooms: "",
  floorAreaSqm: "",
  lotAreaSqm: "",
  features: "",
  images: "",
  videoUrl: "",
  mapEmbedUrl: "",
  agentName: "",
  agentTitle: "",
  agentPhone: "",
  agentEmail: "",
  isFeatured: false,
  isLatest: true
};

export function DashboardPage() {
  const [listings, setListings] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [listingFilter, setListingFilter] = useState<"ALL" | ListingStatus>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setMessage("");

    try {
      const [listingData, inquiryData] = await Promise.all([getListings(), getInquiries()]);
      setListings(listingData);
      setInquiries(inquiryData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load admin data");
    } finally {
      setIsLoading(false);
    }
  }

  const stats = useMemo(() => {
    const available = listings.filter((item) => item.status === "AVAILABLE").length;
    const reserved = listings.filter((item) => item.status === "RESERVED").length;
    const sold = listings.filter((item) => item.status === "SOLD").length;
    const newInquiries = inquiries.filter((item) => item.status === "NEW").length;

    return {
      totalListings: listings.length,
      available,
      reserved,
      sold,
      totalInquiries: inquiries.length,
      newInquiries
    };
  }, [listings, inquiries]);

  const filteredListings = useMemo(() => {
    if (listingFilter === "ALL") return listings;
    return listings.filter((item) => item.status === listingFilter);
  }, [listings, listingFilter]);

  function resetForm() {
    setForm(EMPTY_FORM);
  }

  function editListing(item: Property) {
    setShowForm(true);
    setForm({
      id: item.id,
      title: item.title,
      slug: item.slug,
      description: item.description,
      price: String(item.price),
      currency: item.currency,
      dealType: item.dealType,
      propertyType: item.propertyType,
      status: item.status,
      location: item.location,
      city: item.city,
      province: item.province ?? "",
      bedrooms: item.bedrooms == null ? "" : String(item.bedrooms),
      bathrooms: item.bathrooms == null ? "" : String(item.bathrooms),
      floorAreaSqm: item.floorAreaSqm == null ? "" : String(item.floorAreaSqm),
      lotAreaSqm: item.lotAreaSqm == null ? "" : String(item.lotAreaSqm),
      features: item.features.join(", "),
      images: item.images.join(", "),
      videoUrl: item.videoUrl ?? "",
      mapEmbedUrl: item.mapEmbedUrl ?? "",
      agentName: item.agentName ?? "",
      agentTitle: item.agentTitle ?? "",
      agentPhone: item.agentPhone ?? "",
      agentEmail: item.agentEmail ?? "",
      isFeatured: item.isFeatured,
      isLatest: item.isLatest
    });
  }

  function listingPayload() {
    return {
      title: form.title,
      slug: form.slug || undefined,
      description: form.description,
      price: Number(form.price),
      currency: form.currency,
      dealType: form.dealType,
      propertyType: form.propertyType,
      status: form.status,
      location: form.location,
      city: form.city,
      province: form.province || null,
      bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
      floorAreaSqm: form.floorAreaSqm ? Number(form.floorAreaSqm) : null,
      lotAreaSqm: form.lotAreaSqm ? Number(form.lotAreaSqm) : null,
      features: form.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      videoUrl: form.videoUrl || null,
      mapEmbedUrl: form.mapEmbedUrl || null,
      agentName: form.agentName || null,
      agentTitle: form.agentTitle || null,
      agentPhone: form.agentPhone || null,
      agentEmail: form.agentEmail || null,
      isFeatured: form.isFeatured,
      isLatest: form.isLatest
    };
  }

  async function saveListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      if (form.id) {
        await updateListing(form.id, listingPayload());
        setMessage("Listing updated.");
      } else {
        await createListing(listingPayload());
        setMessage("Listing created.");
      }

      await loadData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save listing");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeListing(id: string) {
    const approved = window.confirm("Remove this listing?");
    if (!approved) return;

    try {
      await deleteListing(id);
      await loadData();
      setMessage("Listing removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to remove listing");
    }
  }

  async function changeListingStatus(id: string, status: ListingStatus) {
    try {
      await updateListingStatus(id, status);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update listing status");
    }
  }

  async function changeInquiryStatus(id: string, status: Inquiry["status"]) {
    try {
      await updateInquiryStatus(id, status);
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update inquiry status");
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div>
          <p className="admin-kicker">Renier's Real Estate</p>
          <h1>Admin Panel</h1>
          <p>Manage listings, inquiries, and availability from one dashboard.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            if (showForm) {
              resetForm();
            }
          }}
        >
          {showForm ? "Close Form" : "Add Listing"}
        </button>
      </header>

      {message ? <p className="notice">{message}</p> : null}

      <section className="stats-grid">
        <article>
          <h3>{stats.totalListings}</h3>
          <p>Total Listings</p>
        </article>
        <article>
          <h3>{stats.available}</h3>
          <p>Available</p>
        </article>
        <article>
          <h3>{stats.reserved}</h3>
          <p>Reserved</p>
        </article>
        <article>
          <h3>{stats.sold}</h3>
          <p>Sold</p>
        </article>
        <article>
          <h3>{stats.totalInquiries}</h3>
          <p>Total Inquiries</p>
        </article>
        <article>
          <h3>{stats.newInquiries}</h3>
          <p>New Inquiries</p>
        </article>
      </section>

      {showForm ? (
        <section className="panel">
          <h2>{form.id ? "Edit Listing" : "Create Listing"}</h2>
          <form className="admin-form" onSubmit={saveListing}>
            <input
              required
              placeholder="Title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              placeholder="Slug (optional)"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            />
            <textarea
              required
              rows={4}
              placeholder="Description"
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
            <input
              required
              inputMode="numeric"
              placeholder="Price"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            />
            <input
              required
              placeholder="Location"
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
            />
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))}
            />
            <input
              placeholder="Province"
              value={form.province}
              onChange={(event) => setForm((prev) => ({ ...prev, province: event.target.value }))}
            />
            <select
              value={form.dealType}
              onChange={(event) => setForm((prev) => ({ ...prev, dealType: event.target.value }))}
            >
              <option value="SALE">Sale</option>
              <option value="RENT">Rent</option>
            </select>
            <select
              value={form.propertyType}
              onChange={(event) => setForm((prev) => ({ ...prev, propertyType: event.target.value }))}
            >
              <option value="HOUSE">House</option>
              <option value="CONDO">Condo</option>
              <option value="APARTMENT">Apartment</option>
              <option value="LOT">Lot</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
            <select
              value={form.status}
              onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>
            <input
              placeholder="Bedrooms"
              value={form.bedrooms}
              onChange={(event) => setForm((prev) => ({ ...prev, bedrooms: event.target.value }))}
            />
            <input
              placeholder="Bathrooms"
              value={form.bathrooms}
              onChange={(event) => setForm((prev) => ({ ...prev, bathrooms: event.target.value }))}
            />
            <input
              placeholder="Floor area sqm"
              value={form.floorAreaSqm}
              onChange={(event) => setForm((prev) => ({ ...prev, floorAreaSqm: event.target.value }))}
            />
            <input
              placeholder="Lot area sqm"
              value={form.lotAreaSqm}
              onChange={(event) => setForm((prev) => ({ ...prev, lotAreaSqm: event.target.value }))}
            />
            <input
              placeholder="Features (comma-separated)"
              value={form.features}
              onChange={(event) => setForm((prev) => ({ ...prev, features: event.target.value }))}
            />
            <input
              placeholder="Image URLs (comma-separated)"
              value={form.images}
              onChange={(event) => setForm((prev) => ({ ...prev, images: event.target.value }))}
            />
            <input
              placeholder="Video embed URL"
              value={form.videoUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
            />
            <input
              placeholder="Google map embed URL"
              value={form.mapEmbedUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, mapEmbedUrl: event.target.value }))}
            />
            <input
              placeholder="Agent name"
              value={form.agentName}
              onChange={(event) => setForm((prev) => ({ ...prev, agentName: event.target.value }))}
            />
            <input
              placeholder="Agent title"
              value={form.agentTitle}
              onChange={(event) => setForm((prev) => ({ ...prev, agentTitle: event.target.value }))}
            />
            <input
              placeholder="Agent phone"
              value={form.agentPhone}
              onChange={(event) => setForm((prev) => ({ ...prev, agentPhone: event.target.value }))}
            />
            <input
              placeholder="Agent email"
              value={form.agentEmail}
              onChange={(event) => setForm((prev) => ({ ...prev, agentEmail: event.target.value }))}
            />

            <label className="toggle">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))}
              />
              Featured Listing
            </label>
            <label className="toggle">
              <input
                type="checkbox"
                checked={form.isLatest}
                onChange={(event) => setForm((prev) => ({ ...prev, isLatest: event.target.checked }))}
              />
              Latest Listing
            </label>

            <div className="form-actions">
              <button disabled={isSaving} type="submit">
                {isSaving ? "Saving..." : form.id ? "Update Listing" : "Create Listing"}
              </button>
              <button
                className="ghost"
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="panel">
        <div className="panel-head">
          <h2>Listings</h2>
          <select value={listingFilter} onChange={(event) => setListingFilter(event.target.value as "ALL" | ListingStatus)}>
            <option value="ALL">All</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        {isLoading ? <p>Loading listings...</p> : null}

        <div className="listing-grid">
          {filteredListings.map((item) => (
            <article key={item.id} className="listing-card">
              <img
                src={item.images[0] ?? "https://images.unsplash.com/photo-1560185007-cde436f6a4d0"}
                alt={item.title}
              />
              <div>
                <h3>{item.title}</h3>
                <p>{item.location}</p>
                <p>{formatPrice(item.price, item.currency)}</p>
                <p>{prettyEnum(item.dealType)} • {prettyEnum(item.propertyType)}</p>
              </div>
              <select
                value={item.status}
                onChange={(event) => changeListingStatus(item.id, event.target.value as ListingStatus)}
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
              <div className="card-actions">
                <button type="button" onClick={() => editListing(item)}>
                  Edit
                </button>
                <button type="button" className="ghost" onClick={() => removeListing(item.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Inquiries</h2>
        {isLoading ? <p>Loading inquiries...</p> : null}

        <div className="inquiry-list">
          {inquiries.map((inquiry) => (
            <article key={inquiry.id} className="inquiry-card">
              <header>
                <h3>{inquiry.name}</h3>
                <small>{new Date(inquiry.createdAt).toLocaleString()}</small>
              </header>
              <p>{inquiry.email}</p>
              {inquiry.phone ? <p>{inquiry.phone}</p> : null}
              <p>
                <strong>Property:</strong> {inquiry.propertyTitle || "General inquiry"}
              </p>
              <p>{inquiry.message}</p>
              <label>
                Status
                <select
                  value={inquiry.status}
                  onChange={(event) => changeInquiryStatus(inquiry.id, event.target.value as Inquiry["status"])}
                >
                  <option value="NEW">New</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}