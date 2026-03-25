import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings } from "../lib/api";
import { PropertyCard } from "../components/PropertyCard";
export function PropertiesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [properties, setProperties] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageCount, setPageCount] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const filters = useMemo(() => ({
        search: searchParams.get("search") ?? "",
        city: searchParams.get("city") ?? "",
        dealType: searchParams.get("dealType") ?? "",
        propertyType: searchParams.get("propertyType") ?? "",
        status: searchParams.get("status") ?? "",
        minPrice: searchParams.get("minPrice") ?? "",
        maxPrice: searchParams.get("maxPrice") ?? "",
        page: Number(searchParams.get("page") ?? 1)
    }), [searchParams]);
    useEffect(() => {
        let active = true;
        async function loadListings() {
            setIsLoading(true);
            setError("");
            try {
                const response = await getListings({
                    ...filters,
                    page: filters.page || 1,
                    pageSize: 9
                });
                if (!active)
                    return;
                setProperties(response.data);
                setTotal(response.meta.total);
                setPageCount(response.meta.pageCount || 1);
            }
            catch (loadError) {
                if (active) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load properties");
                }
            }
            finally {
                if (active)
                    setIsLoading(false);
            }
        }
        loadListings();
        return () => {
            active = false;
        };
    }, [filters]);
    function updateFilter(key, value) {
        const next = new URLSearchParams(searchParams);
        if (value) {
            next.set(key, value);
        }
        else {
            next.delete(key);
        }
        if (key !== "page") {
            next.set("page", "1");
        }
        setSearchParams(next);
    }
    function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        [
            "search",
            "city",
            "dealType",
            "propertyType",
            "status",
            "minPrice",
            "maxPrice"
        ].forEach((key) => updateFilter(key, String(formData.get(key) ?? "")));
    }
    function setPage(nextPage) {
        updateFilter("page", String(nextPage));
    }
    return (_jsx("section", { className: "section", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "directory-header", children: [_jsx("p", { className: "eyebrow", children: "Property directory" }), _jsx("h1", { children: "Explore premium listings" }), _jsx("p", { className: "muted", children: "Find homes and lots by location, budget, deal type, and availability." })] }), _jsx("div", { className: "filter-shell", children: _jsxs("form", { className: "filter-grid", onSubmit: onSubmit, children: [_jsx("input", { defaultValue: filters.search, name: "search", placeholder: "Search keywords" }), _jsx("input", { defaultValue: filters.city, name: "city", placeholder: "City" }), _jsxs("select", { defaultValue: filters.dealType, name: "dealType", children: [_jsx("option", { value: "", children: "Deal Type" }), _jsx("option", { value: "SALE", children: "Sale" }), _jsx("option", { value: "RENT", children: "Rent" })] }), _jsxs("select", { defaultValue: filters.propertyType, name: "propertyType", children: [_jsx("option", { value: "", children: "Property Type" }), _jsx("option", { value: "HOUSE", children: "House" }), _jsx("option", { value: "CONDO", children: "Condo" }), _jsx("option", { value: "APARTMENT", children: "Apartment" }), _jsx("option", { value: "LOT", children: "Lot" }), _jsx("option", { value: "COMMERCIAL", children: "Commercial" })] }), _jsxs("select", { defaultValue: filters.status, name: "status", children: [_jsx("option", { value: "", children: "Availability" }), _jsx("option", { value: "AVAILABLE", children: "Available" }), _jsx("option", { value: "RESERVED", children: "Reserved" }), _jsx("option", { value: "SOLD", children: "Sold" })] }), _jsx("input", { defaultValue: filters.minPrice, name: "minPrice", placeholder: "Min Price", inputMode: "numeric" }), _jsx("input", { defaultValue: filters.maxPrice, name: "maxPrice", placeholder: "Max Price", inputMode: "numeric" }), _jsx("button", { type: "submit", children: "Apply Filters" })] }) }), error && _jsx("p", { className: "form-message error", children: error }), isLoading ? _jsx("p", { className: "muted", children: "Loading listings..." }) : null, _jsx("div", { className: "cards-grid", children: properties.map((property) => (_jsx(PropertyCard, { property: property }, property.id))) }), !isLoading && properties.length === 0 ? _jsx("p", { className: "muted", children: "No listings found for these filters." }) : null, _jsxs("div", { className: "pagination", children: [_jsx("button", { disabled: filters.page <= 1, onClick: () => setPage(filters.page - 1), children: "Previous" }), _jsxs("span", { children: ["Page ", filters.page, " of ", pageCount, " \u2022 ", total, " listings"] }), _jsx("button", { disabled: filters.page >= pageCount, onClick: () => setPage(filters.page + 1), children: "Next" })] })] }) }));
}
