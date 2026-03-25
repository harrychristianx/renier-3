import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListings } from "../lib/api";
import { PropertyCard } from "../components/PropertyCard";
const HERO_IMAGE = "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1700&q=80";
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
                    getListings({ featured: true, pageSize: 3 }),
                    getListings({ latest: true, pageSize: 3 })
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
    return (_jsxs(_Fragment, { children: [_jsxs("section", { className: "hero", children: [_jsxs("div", { className: "container hero-grid", children: [_jsxs("div", { className: "hero-copy", children: [_jsx("p", { className: "eyebrow", children: "Modern premium real estate experience" }), _jsx("h1", { children: "Find homes that look exceptional online and feel right in person." }), _jsx("p", { children: "Renier's Real Estate combines luxury-grade visuals, fast search, and direct agent access so buyers and renters can move from discovery to decision with confidence." }), _jsxs("div", { className: "hero-actions", children: [_jsx(Link, { className: "cta-btn", to: "/properties", children: "Explore Listings" }), _jsx(Link, { className: "ghost-btn", to: "/properties?intent=viewing", children: "Book a Viewing" })] })] }), _jsxs("div", { className: "hero-visual", "aria-hidden": "true", children: [_jsx("img", { src: HERO_IMAGE, alt: "Premium home exterior" }), _jsxs("div", { className: "hero-float-card", children: [_jsx("p", { children: "Curated homes" }), _jsx("strong", { children: "10,000+" }), _jsx("span", { children: "buyers and renters served" })] })] })] }), _jsx("div", { className: "container", children: _jsxs("form", { className: "hero-search", onSubmit: onSearch, children: [_jsxs("label", { children: ["Location", _jsx("input", { value: location, onChange: (event) => setLocation(event.target.value), placeholder: "City or barangay" })] }), _jsxs("label", { children: ["Property Type", _jsxs("select", { value: propertyType, onChange: (event) => setPropertyType(event.target.value), children: [_jsx("option", { value: "", children: "Any type" }), _jsx("option", { value: "HOUSE", children: "House" }), _jsx("option", { value: "CONDO", children: "Condo" }), _jsx("option", { value: "APARTMENT", children: "Apartment" }), _jsx("option", { value: "LOT", children: "Lot" }), _jsx("option", { value: "COMMERCIAL", children: "Commercial" })] })] }), _jsxs("label", { children: ["Max Budget (PHP)", _jsx("input", { value: maxPrice, onChange: (event) => setMaxPrice(event.target.value), placeholder: "e.g. 7000000", inputMode: "numeric" })] }), _jsx("button", { type: "submit", children: "Search Properties" })] }) })] }), _jsx("section", { className: "section trust-section", children: _jsxs("div", { className: "container trust-strip", id: "about", children: [_jsxs("article", { children: [_jsx("strong", { children: "6-7 weeks" }), _jsx("p", { children: "Project timeline from planning to live launch" })] }), _jsxs("article", { children: [_jsx("strong", { children: "Mobile-first" }), _jsx("p", { children: "Optimized for modern phone browsing and fast lead capture" })] }), _jsxs("article", { children: [_jsx("strong", { children: "Always updated" }), _jsx("p", { children: "Availability and pricing managed in real time by admin" })] })] }) }), _jsxs("section", { className: "section listings-section", children: [_jsxs("div", { className: "container section-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Handpicked" }), _jsx("h2", { children: "Popular Listings" })] }), _jsx(Link, { to: "/properties", children: "Browse all" })] }), error && _jsx("p", { className: "container form-message error", children: error }), isLoading ? (_jsx("p", { className: "container muted", children: "Loading featured listings..." })) : (_jsx("div", { className: "container cards-grid", children: featured.map((property) => (_jsx(PropertyCard, { property: property }, property.id))) }))] }), _jsxs("section", { className: "section section-soft", id: "services", children: [_jsx("div", { className: "container section-head", children: _jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Services" }), _jsx("h2", { children: "Built to convert views into serious leads" })] }) }), _jsxs("div", { className: "container services-grid", children: [_jsxs("article", { children: [_jsx("h3", { children: "Sell with precision" }), _jsx("p", { children: "Premium listing presentation with maps, media, and clear market-ready positioning." })] }), _jsxs("article", { children: [_jsx("h3", { children: "Buy with clarity" }), _jsx("p", { children: "Refined filters and structured property details for faster shortlist decisions." })] }), _jsxs("article", { children: [_jsx("h3", { children: "Respond faster" }), _jsx("p", { children: "Centralized inquiry management helps your team follow up while intent is still high." })] })] })] }), _jsxs("section", { className: "section", children: [_jsxs("div", { className: "container section-head", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "New this week" }), _jsx("h2", { children: "Latest Listings" })] }), _jsx(Link, { to: "/properties", children: "See more" })] }), isLoading ? (_jsx("p", { className: "container muted", children: "Loading latest listings..." })) : (_jsx("div", { className: "container cards-grid", children: latest.map((property) => (_jsx(PropertyCard, { property: property }, property.id))) }))] }), _jsx("section", { className: "section section-soft", id: "join", children: _jsxs("div", { className: "container split-banner", children: [_jsxs("div", { children: [_jsx("h3", { children: "Partner Developers" }), _jsx("p", { children: "Trusted collaborations across local and national property developers." }), _jsxs("div", { className: "logo-row", children: [_jsx("span", { children: "UrbanRise" }), _jsx("span", { children: "MetroLand" }), _jsx("span", { children: "Aspire Homes" }), _jsx("span", { children: "BlueBay Estates" })] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Client Testimonials" }), _jsx("blockquote", { children: "\"Smooth process from inquiry to viewing. The listing details were accurate and complete.\"" }), _jsx("p", { children: "- Carla M., first-time buyer" })] })] }) }), _jsx("section", { className: "section", id: "news", children: _jsxs("div", { className: "container cta-band", children: [_jsx("h3", { children: "Ready to list or book a viewing?" }), _jsx("p", { children: "Launch your next move with a platform designed for speed, trust, and premium presentation." }), _jsxs("div", { className: "cta-row", children: [_jsx(Link, { className: "cta-btn", to: "/properties", children: "Browse Properties" }), _jsx(Link, { className: "ghost-btn", to: "/properties?intent=viewing", children: "Book a Viewing" })] })] }) }), _jsx("section", { className: "section section-soft", id: "contact", children: _jsxs("div", { className: "container footer-info", children: [_jsxs("div", { children: [_jsx("h4", { children: "Contact" }), _jsx("p", { children: "Email: hello@reniersrealestate.com" }), _jsx("p", { children: "Phone: +63 917 000 1122" })] }), _jsxs("div", { children: [_jsx("h4", { children: "Office" }), _jsx("p", { children: "Cagayan de Oro, Misamis Oriental" }), _jsx("p", { children: "Mon-Sat, 9:00 AM to 6:00 PM" })] }), _jsxs("div", { children: [_jsx("h4", { children: "Follow" }), _jsx("p", { children: "Facebook / Instagram / YouTube" })] })] }) })] }));
}
