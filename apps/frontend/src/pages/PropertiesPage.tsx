import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getListings } from "../lib/api";
import type { Property } from "../lib/types";
import { PropertyCard } from "../components/PropertyCard";

export function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filters = useMemo(
    () => ({
      search: searchParams.get("search") ?? "",
      city: searchParams.get("city") ?? "",
      dealType: searchParams.get("dealType") ?? "",
      propertyType: searchParams.get("propertyType") ?? "",
      status: searchParams.get("status") ?? "",
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      page: Number(searchParams.get("page") ?? 1)
    }),
    [searchParams]
  );

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

        if (!active) return;
        setProperties(response.data);
        setTotal(response.meta.total);
        setPageCount(response.meta.pageCount || 1);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load properties");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadListings();

    return () => {
      active = false;
    };
  }, [filters]);

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);

    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }

    if (key !== "page") {
      next.set("page", "1");
    }

    setSearchParams(next);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
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

  function setPage(nextPage: number) {
    updateFilter("page", String(nextPage));
  }

  return (
    <section className="section">
      <div className="container">
        <div className="directory-header">
          <p className="eyebrow">Property directory</p>
          <h1>Explore premium listings</h1>
          <p className="muted">Find homes and lots by location, budget, deal type, and availability.</p>
        </div>

        <div className="filter-shell">
          <form className="filter-grid" onSubmit={onSubmit}>
            <input defaultValue={filters.search} name="search" placeholder="Search keywords" />
            <input defaultValue={filters.city} name="city" placeholder="City" />
            <select defaultValue={filters.dealType} name="dealType">
              <option value="">Deal Type</option>
              <option value="SALE">Sale</option>
              <option value="RENT">Rent</option>
            </select>
            <select defaultValue={filters.propertyType} name="propertyType">
              <option value="">Property Type</option>
              <option value="HOUSE">House</option>
              <option value="CONDO">Condo</option>
              <option value="APARTMENT">Apartment</option>
              <option value="LOT">Lot</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
            <select defaultValue={filters.status} name="status">
              <option value="">Availability</option>
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>
            <input defaultValue={filters.minPrice} name="minPrice" placeholder="Min Price" inputMode="numeric" />
            <input defaultValue={filters.maxPrice} name="maxPrice" placeholder="Max Price" inputMode="numeric" />
            <button type="submit">Apply Filters</button>
          </form>
        </div>

        {error && <p className="form-message error">{error}</p>}
        {isLoading ? <p className="muted">Loading listings...</p> : null}

        <div className="cards-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {!isLoading && properties.length === 0 ? <p className="muted">No listings found for these filters.</p> : null}

        <div className="pagination">
          <button disabled={filters.page <= 1} onClick={() => setPage(filters.page - 1)}>
            Previous
          </button>
          <span>
            Page {filters.page} of {pageCount} • {total} listings
          </span>
          <button disabled={filters.page >= pageCount} onClick={() => setPage(filters.page + 1)}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
