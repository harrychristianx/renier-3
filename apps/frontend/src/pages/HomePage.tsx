import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListings } from "../lib/api";
import type { Property } from "../lib/types";
import { PropertyCard } from "../components/PropertyCard";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1700&q=80";

export function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [latest, setLatest] = useState<Property[]>([]);
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

        if (!active) return;

        setFeatured(featuredResponse.data);
        setLatest(latestResponse.data);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load listings");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = new URLSearchParams();
    if (location.trim()) query.set("city", location.trim());
    if (propertyType) query.set("propertyType", propertyType);
    if (maxPrice.trim()) query.set("maxPrice", maxPrice.trim());

    navigate(`/properties?${query.toString()}`);
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Modern premium real estate experience</p>
            <h1>Find homes that look exceptional online and feel right in person.</h1>
            <p>
              Renier's Real Estate combines luxury-grade visuals, fast search, and direct agent access so buyers and
              renters can move from discovery to decision with confidence.
            </p>
            <div className="hero-actions">
              <Link className="cta-btn" to="/properties">
                Explore Listings
              </Link>
              <Link className="ghost-btn" to="/properties?intent=viewing">
                Book a Viewing
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <img src={HERO_IMAGE} alt="Premium home exterior" />
            <div className="hero-float-card">
              <p>Curated homes</p>
              <strong>10,000+</strong>
              <span>buyers and renters served</span>
            </div>
          </div>
        </div>

        <div className="container">
          <form className="hero-search" onSubmit={onSearch}>
            <label>
              Location
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or barangay"
              />
            </label>
            <label>
              Property Type
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                <option value="">Any type</option>
                <option value="HOUSE">House</option>
                <option value="CONDO">Condo</option>
                <option value="APARTMENT">Apartment</option>
                <option value="LOT">Lot</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </label>
            <label>
              Max Budget (PHP)
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="e.g. 7000000"
                inputMode="numeric"
              />
            </label>
            <button type="submit">Search Properties</button>
          </form>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container trust-strip" id="about">
          <article>
            <strong>6-7 weeks</strong>
            <p>Project timeline from planning to live launch</p>
          </article>
          <article>
            <strong>Mobile-first</strong>
            <p>Optimized for modern phone browsing and fast lead capture</p>
          </article>
          <article>
            <strong>Always updated</strong>
            <p>Availability and pricing managed in real time by admin</p>
          </article>
        </div>
      </section>

      <section className="section listings-section">
        <div className="container section-head">
          <div>
            <p className="eyebrow">Handpicked</p>
            <h2>Popular Listings</h2>
          </div>
          <Link to="/properties">Browse all</Link>
        </div>

        {error && <p className="container form-message error">{error}</p>}
        {isLoading ? (
          <p className="container muted">Loading featured listings...</p>
        ) : (
          <div className="container cards-grid">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="section section-soft" id="services">
        <div className="container section-head">
          <div>
            <p className="eyebrow">Services</p>
            <h2>Built to convert views into serious leads</h2>
          </div>
        </div>

        <div className="container services-grid">
          <article>
            <h3>Sell with precision</h3>
            <p>Premium listing presentation with maps, media, and clear market-ready positioning.</p>
          </article>
          <article>
            <h3>Buy with clarity</h3>
            <p>Refined filters and structured property details for faster shortlist decisions.</p>
          </article>
          <article>
            <h3>Respond faster</h3>
            <p>Centralized inquiry management helps your team follow up while intent is still high.</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container section-head">
          <div>
            <p className="eyebrow">New this week</p>
            <h2>Latest Listings</h2>
          </div>
          <Link to="/properties">See more</Link>
        </div>

        {isLoading ? (
          <p className="container muted">Loading latest listings...</p>
        ) : (
          <div className="container cards-grid">
            {latest.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      <section className="section section-soft" id="join">
        <div className="container split-banner">
          <div>
            <h3>Partner Developers</h3>
            <p>Trusted collaborations across local and national property developers.</p>
            <div className="logo-row">
              <span>UrbanRise</span>
              <span>MetroLand</span>
              <span>Aspire Homes</span>
              <span>BlueBay Estates</span>
            </div>
          </div>
          <div>
            <h3>Client Testimonials</h3>
            <blockquote>
              "Smooth process from inquiry to viewing. The listing details were accurate and complete."
            </blockquote>
            <p>- Carla M., first-time buyer</p>
          </div>
        </div>
      </section>

      <section className="section" id="news">
        <div className="container cta-band">
          <h3>Ready to list or book a viewing?</h3>
          <p>Launch your next move with a platform designed for speed, trust, and premium presentation.</p>
          <div className="cta-row">
            <Link className="cta-btn" to="/properties">
              Browse Properties
            </Link>
            <Link className="ghost-btn" to="/properties?intent=viewing">
              Book a Viewing
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-soft" id="contact">
        <div className="container footer-info">
          <div>
            <h4>Contact</h4>
            <p>Email: hello@reniersrealestate.com</p>
            <p>Phone: +63 917 000 1122</p>
          </div>
          <div>
            <h4>Office</h4>
            <p>Cagayan de Oro, Misamis Oriental</p>
            <p>Mon-Sat, 9:00 AM to 6:00 PM</p>
          </div>
          <div>
            <h4>Follow</h4>
            <p>Facebook / Instagram / YouTube</p>
          </div>
        </div>
      </section>
    </>
  );
}
