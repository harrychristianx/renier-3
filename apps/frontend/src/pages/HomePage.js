import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListings } from "../lib/api";
import { PropertyCard } from "../components/PropertyCard";
const HERO_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1700&q=80";
export function HomePage() {
    const [featured, setFeatured] = useState([]);
    const [latest, setLatest] = useState([]);
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        let active = true;
        async function load() {
            setIsLoading(true);
            setError("");
            try {
                const [featuredResponse, latestResponse] = await Promise.all([
                    getListings({ featured: true, pageSize: 6 }),
                    getListings({ latest: true, pageSize: 6 })
                ]);
                if (!active)
                    return;
                setFeatured(featuredResponse.data);
                setLatest(latestResponse.data);
            }
            catch (loadError) {
                if (active) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load listings");
                }
            }
            finally {
                if (active)
                    setIsLoading(false);
            }
        }
        load();
        return () => {
            active = false;
        };
    }, []);
    function onSearch(event) {
        event.preventDefault();
        const query = new URLSearchParams();
        if (location.trim())
            query.set("city", location.trim());
        if (propertyType)
            query.set("propertyType", propertyType);
        if (maxPrice.trim())
            query.set("maxPrice", maxPrice.trim());
        navigate(`/properties?${query.toString()}`);
    }
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "hero", children: [_jsxs("div", { className: "container hero-grid", children: [_jsxs("div", { className: "hero-copy", children: [_jsx("p", { className: "eyebrow", children: "Stay-inspired property browsing" }), _jsx("h1", { children: "Discover homes with an Airbnb-like browsing experience." }), _jsx("p", { children: "Browse faster with compact cards, flexible filters, and instant booking inquiry flow for every listing." }), _jsxs("div", { className: "hero-actions", children: [_jsx(Link, { className: "cta-btn", to: "/properties", children: "Start Exploring" }), _jsx(Link, { className: "ghost-btn", to: "/properties?intent=viewing", children: "Book a Viewing" })] })] }), _jsxs("div", { className: "hero-visual", "aria-hidden": "true", children: [_jsx("img", { src: HERO_IMAGE, alt: "Cozy interior" }), _jsxs("div", { className: "hero-float-card", children: [_jsx("p", { children: "Fresh listings today" }), _jsx("strong", { children: "120+" }), _jsx("span", { children: "compact, filter-first browsing" })] })] })] }), _jsx("div", { className: "container", children: _jsxs("form", { className: "hero-search", onSubmit: onSearch, children: [_jsxs("label", { children: ["Where", _jsx("input", { value: location, onChange: (event) => setLocation(event.target.value), placeholder: "City or barangay" })] }), _jsxs("label", { children: ["Property type", _jsxs("select", { value: propertyType, onChange: (event) => setPropertyType(event.target.value), children: [_jsx("option", { value: "", children: "Any type" }), _jsx("option", { value: "HOUSE", children: "House" }), _jsx("option", { value: "CONDO", children: "Condo" }), _jsx("option", { value: "APARTMENT", children: "Apartment" }), _jsx("option", { value: "LOT", children: "Lot" }), _jsx("option", { value: "COMMERCIAL", children: "Commercial" })] })] }), _jsxs("label", { children: ["Max budget", _jsx("input", { value: maxPrice, onChange: (event) => setMaxPrice(event.target.value), placeholder: "e.g. 7000000", inputMode: "numeric" })] }), _jsx("button", { type: "submit", children: "Search" })] }) }), _jsxs("div", { className: "container category-strip", id: "about", children: [_jsx("span", { children: "Entire homes" }), _jsx("span", { children: "Condos" }), _jsx("span", { children: "City center" }), _jsx("span", { children: "Near schools" }), _jsx("span", { children: "Investment ready" }), _jsx("span", { children: "Family friendly" })] })] }), _jsx("section", { className: "section trust-section", children: _jsxs("div", { className: "container trust-strip", children: [_jsxs("article", { children: [_jsx("strong", { children: "Mobile first" }), _jsx("p", { children: "Optimized spacing and controls for thumb-friendly navigation." })] }), _jsxs("article", { children: [_jsx("strong", { children: "Fast response" }), _jsx("p", { children: "Booking and inquiry requests go directly to admin for follow-up." })] }), _jsxs("article", { children: [_jsx("strong", { children: "Always updated" }), _jsx("p", { children: "Listing status is managed in real time by your team." })] })] }) }), _jsxs("section", { className: "section listings-section", id: "services", children: [_jsxs("div", { className: "container section-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Trending now" }), _jsx("h2", { children: "Popular Listings" })] }), _jsx(Link, { to: "/properties", children: "Browse all" })] }), error && _jsx("p", { className: "container form-message error", children: error }), isLoading ? (_jsx("p", { className: "container muted", children: "Loading featured listings..." })) : (_jsx("div", { className: "container cards-grid", children: featured.map((property) => (_jsx(PropertyCard, { property: property }, property.id))) }))] }), _jsx("section", { className: "section section-soft", id: "join", children: _jsxs("div", { className: "container split-banner", children: [_jsxs("div", { children: [_jsx("h3", { children: "Partner Developers" }), _jsx("p", { children: "Trusted collaborations with local and national property developers." }), _jsxs("div", { className: "logo-row", children: [_jsx("span", { children: "UrbanRise" }), _jsx("span", { children: "MetroLand" }), _jsx("span", { children: "Aspire Homes" }), _jsx("span", { children: "BlueBay Estates" })] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Client Testimonials" }), _jsx("blockquote", { children: "\"The booking process felt very easy on mobile, and we got confirmation quickly.\"" }), _jsx("p", { children: "- Paula R., renter" })] })] }) }), _jsxs("section", { className: "section", id: "news", children: [_jsxs("div", { className: "container section-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Recently added" }), _jsx("h2", { children: "Latest Listings" })] }), _jsx(Link, { to: "/properties", children: "See more" })] }), isLoading ? (_jsx("p", { className: "container muted", children: "Loading latest listings..." })) : (_jsx("div", { className: "container cards-grid", children: latest.map((property) => (_jsx(PropertyCard, { property: property }, property.id))) }))] }), _jsx("section", { className: "section section-soft", id: "contact", children: _jsxs("div", { className: "container cta-band", children: [_jsx("h3", { children: "Need a fast viewing schedule?" }), _jsx("p", { children: "Choose a listing and send a booking request in less than a minute." }), _jsxs("div", { className: "cta-row", children: [_jsx(Link, { className: "cta-btn", to: "/properties", children: "Browse Listings" }), _jsx(Link, { className: "ghost-btn", to: "/properties?intent=viewing", children: "Book a Viewing" })] })] }) })] }));
}
