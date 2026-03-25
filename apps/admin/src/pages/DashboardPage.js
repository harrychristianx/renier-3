import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { createListing, deleteListing, formatPrice, getInquiries, getListings, prettyEnum, updateInquiryStatus, updateListing, updateListingStatus } from "../lib/api";
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
    const [listings, setListings] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const [listingFilter, setListingFilter] = useState("ALL");
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
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to load admin data");
        }
        finally {
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
        if (listingFilter === "ALL")
            return listings;
        return listings.filter((item) => item.status === listingFilter);
    }, [listings, listingFilter]);
    function resetForm() {
        setForm(EMPTY_FORM);
    }
    function editListing(item) {
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
    async function saveListing(event) {
        event.preventDefault();
        setIsSaving(true);
        setMessage("");
        try {
            if (form.id) {
                await updateListing(form.id, listingPayload());
                setMessage("Listing updated.");
            }
            else {
                await createListing(listingPayload());
                setMessage("Listing created.");
            }
            await loadData();
            resetForm();
            setShowForm(false);
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to save listing");
        }
        finally {
            setIsSaving(false);
        }
    }
    async function removeListing(id) {
        const approved = window.confirm("Remove this listing?");
        if (!approved)
            return;
        try {
            await deleteListing(id);
            await loadData();
            setMessage("Listing removed.");
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to remove listing");
        }
    }
    async function changeListingStatus(id, status) {
        try {
            await updateListingStatus(id, status);
            await loadData();
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to update listing status");
        }
    }
    async function changeInquiryStatus(id, status) {
        try {
            await updateInquiryStatus(id, status);
            await loadData();
        }
        catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to update inquiry status");
        }
    }
    return (_jsxs("div", { className: "admin-shell", children: [_jsxs("header", { className: "admin-header", children: [_jsxs("div", { children: [_jsx("p", { className: "admin-kicker", children: "Renier's Real Estate" }), _jsx("h1", { children: "Admin Panel" }), _jsx("p", { children: "Manage listings, inquiries, and availability from one dashboard." })] }), _jsx("button", { type: "button", onClick: () => {
                            setShowForm((prev) => !prev);
                            if (showForm) {
                                resetForm();
                            }
                        }, children: showForm ? "Close Form" : "Add Listing" })] }), message ? _jsx("p", { className: "notice", children: message }) : null, _jsxs("section", { className: "stats-grid", children: [_jsxs("article", { children: [_jsx("h3", { children: stats.totalListings }), _jsx("p", { children: "Total Listings" })] }), _jsxs("article", { children: [_jsx("h3", { children: stats.available }), _jsx("p", { children: "Available" })] }), _jsxs("article", { children: [_jsx("h3", { children: stats.reserved }), _jsx("p", { children: "Reserved" })] }), _jsxs("article", { children: [_jsx("h3", { children: stats.sold }), _jsx("p", { children: "Sold" })] }), _jsxs("article", { children: [_jsx("h3", { children: stats.totalInquiries }), _jsx("p", { children: "Total Inquiries" })] }), _jsxs("article", { children: [_jsx("h3", { children: stats.newInquiries }), _jsx("p", { children: "New Inquiries" })] })] }), showForm ? (_jsxs("section", { className: "panel", children: [_jsx("h2", { children: form.id ? "Edit Listing" : "Create Listing" }), _jsxs("form", { className: "admin-form", onSubmit: saveListing, children: [_jsx("input", { required: true, placeholder: "Title", value: form.title, onChange: (event) => setForm((prev) => ({ ...prev, title: event.target.value })) }), _jsx("input", { placeholder: "Slug (optional)", value: form.slug, onChange: (event) => setForm((prev) => ({ ...prev, slug: event.target.value })) }), _jsx("textarea", { required: true, rows: 4, placeholder: "Description", value: form.description, onChange: (event) => setForm((prev) => ({ ...prev, description: event.target.value })) }), _jsx("input", { required: true, inputMode: "numeric", placeholder: "Price", value: form.price, onChange: (event) => setForm((prev) => ({ ...prev, price: event.target.value })) }), _jsx("input", { required: true, placeholder: "Location", value: form.location, onChange: (event) => setForm((prev) => ({ ...prev, location: event.target.value })) }), _jsx("input", { required: true, placeholder: "City", value: form.city, onChange: (event) => setForm((prev) => ({ ...prev, city: event.target.value })) }), _jsx("input", { placeholder: "Province", value: form.province, onChange: (event) => setForm((prev) => ({ ...prev, province: event.target.value })) }), _jsxs("select", { value: form.dealType, onChange: (event) => setForm((prev) => ({ ...prev, dealType: event.target.value })), children: [_jsx("option", { value: "SALE", children: "Sale" }), _jsx("option", { value: "RENT", children: "Rent" })] }), _jsxs("select", { value: form.propertyType, onChange: (event) => setForm((prev) => ({ ...prev, propertyType: event.target.value })), children: [_jsx("option", { value: "HOUSE", children: "House" }), _jsx("option", { value: "CONDO", children: "Condo" }), _jsx("option", { value: "APARTMENT", children: "Apartment" }), _jsx("option", { value: "LOT", children: "Lot" }), _jsx("option", { value: "COMMERCIAL", children: "Commercial" })] }), _jsxs("select", { value: form.status, onChange: (event) => setForm((prev) => ({ ...prev, status: event.target.value })), children: [_jsx("option", { value: "AVAILABLE", children: "Available" }), _jsx("option", { value: "RESERVED", children: "Reserved" }), _jsx("option", { value: "SOLD", children: "Sold" })] }), _jsx("input", { placeholder: "Bedrooms", value: form.bedrooms, onChange: (event) => setForm((prev) => ({ ...prev, bedrooms: event.target.value })) }), _jsx("input", { placeholder: "Bathrooms", value: form.bathrooms, onChange: (event) => setForm((prev) => ({ ...prev, bathrooms: event.target.value })) }), _jsx("input", { placeholder: "Floor area sqm", value: form.floorAreaSqm, onChange: (event) => setForm((prev) => ({ ...prev, floorAreaSqm: event.target.value })) }), _jsx("input", { placeholder: "Lot area sqm", value: form.lotAreaSqm, onChange: (event) => setForm((prev) => ({ ...prev, lotAreaSqm: event.target.value })) }), _jsx("input", { placeholder: "Features (comma-separated)", value: form.features, onChange: (event) => setForm((prev) => ({ ...prev, features: event.target.value })) }), _jsx("input", { placeholder: "Image URLs (comma-separated)", value: form.images, onChange: (event) => setForm((prev) => ({ ...prev, images: event.target.value })) }), _jsx("input", { placeholder: "Video embed URL", value: form.videoUrl, onChange: (event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value })) }), _jsx("input", { placeholder: "Google map embed URL", value: form.mapEmbedUrl, onChange: (event) => setForm((prev) => ({ ...prev, mapEmbedUrl: event.target.value })) }), _jsx("input", { placeholder: "Agent name", value: form.agentName, onChange: (event) => setForm((prev) => ({ ...prev, agentName: event.target.value })) }), _jsx("input", { placeholder: "Agent title", value: form.agentTitle, onChange: (event) => setForm((prev) => ({ ...prev, agentTitle: event.target.value })) }), _jsx("input", { placeholder: "Agent phone", value: form.agentPhone, onChange: (event) => setForm((prev) => ({ ...prev, agentPhone: event.target.value })) }), _jsx("input", { placeholder: "Agent email", value: form.agentEmail, onChange: (event) => setForm((prev) => ({ ...prev, agentEmail: event.target.value })) }), _jsxs("label", { className: "toggle", children: [_jsx("input", { type: "checkbox", checked: form.isFeatured, onChange: (event) => setForm((prev) => ({ ...prev, isFeatured: event.target.checked })) }), "Featured Listing"] }), _jsxs("label", { className: "toggle", children: [_jsx("input", { type: "checkbox", checked: form.isLatest, onChange: (event) => setForm((prev) => ({ ...prev, isLatest: event.target.checked })) }), "Latest Listing"] }), _jsxs("div", { className: "form-actions", children: [_jsx("button", { disabled: isSaving, type: "submit", children: isSaving ? "Saving..." : form.id ? "Update Listing" : "Create Listing" }), _jsx("button", { className: "ghost", type: "button", onClick: () => {
                                            resetForm();
                                            setShowForm(false);
                                        }, children: "Cancel" })] })] })] })) : null, _jsxs("section", { className: "panel", children: [_jsxs("div", { className: "panel-head", children: [_jsx("h2", { children: "Listings" }), _jsxs("select", { value: listingFilter, onChange: (event) => setListingFilter(event.target.value), children: [_jsx("option", { value: "ALL", children: "All" }), _jsx("option", { value: "AVAILABLE", children: "Available" }), _jsx("option", { value: "RESERVED", children: "Reserved" }), _jsx("option", { value: "SOLD", children: "Sold" })] })] }), isLoading ? _jsx("p", { children: "Loading listings..." }) : null, _jsx("div", { className: "listing-grid", children: filteredListings.map((item) => (_jsxs("article", { className: "listing-card", children: [_jsx("img", { src: item.images[0] ?? "https://images.unsplash.com/photo-1560185007-cde436f6a4d0", alt: item.title }), _jsxs("div", { children: [_jsx("h3", { children: item.title }), _jsx("p", { children: item.location }), _jsx("p", { children: formatPrice(item.price, item.currency) }), _jsxs("p", { children: [prettyEnum(item.dealType), " \uFFFD ", prettyEnum(item.propertyType)] })] }), _jsxs("select", { value: item.status, onChange: (event) => changeListingStatus(item.id, event.target.value), children: [_jsx("option", { value: "AVAILABLE", children: "Available" }), _jsx("option", { value: "RESERVED", children: "Reserved" }), _jsx("option", { value: "SOLD", children: "Sold" })] }), _jsxs("div", { className: "card-actions", children: [_jsx("button", { type: "button", onClick: () => editListing(item), children: "Edit" }), _jsx("button", { type: "button", className: "ghost", onClick: () => removeListing(item.id), children: "Delete" })] })] }, item.id))) })] }), _jsxs("section", { className: "panel", children: [_jsx("h2", { children: "Inquiries" }), isLoading ? _jsx("p", { children: "Loading inquiries..." }) : null, _jsx("div", { className: "inquiry-list", children: inquiries.map((inquiry) => (_jsxs("article", { className: "inquiry-card", children: [_jsxs("header", { children: [_jsx("h3", { children: inquiry.name }), _jsx("small", { children: new Date(inquiry.createdAt).toLocaleString() })] }), _jsx("p", { children: inquiry.email }), inquiry.phone ? _jsx("p", { children: inquiry.phone }) : null, _jsxs("p", { children: [_jsx("strong", { children: "Property:" }), " ", inquiry.propertyTitle || "General inquiry"] }), _jsx("p", { children: inquiry.message }), _jsxs("label", { children: ["Status", _jsxs("select", { value: inquiry.status, onChange: (event) => changeInquiryStatus(inquiry.id, event.target.value), children: [_jsx("option", { value: "NEW", children: "New" }), _jsx("option", { value: "CONTACTED", children: "Contacted" }), _jsx("option", { value: "CLOSED", children: "Closed" })] })] })] }, inquiry.id))) })] })] }));
}
