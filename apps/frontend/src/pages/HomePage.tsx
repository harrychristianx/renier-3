import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getListings } from "../lib/api";
import type { Property } from "../lib/types";
import { PropertyCard } from "../components/PropertyCard";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1700&q=80";
const AUTO_SLIDE_MS = 5000;
const RESUME_AFTER_MS = 6500;

export function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [latest, setLatest] = useState<Property[]>([]);
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const navigate = useNavigate();
  const featuredScrollRef = useRef<HTMLDivElement | null>(null);
  const resumeTimerRef = useRef<number | null>(null);

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

  useEffect(() => {
    setActiveFeaturedIndex(0);
  }, [featured.length]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = featuredScrollRef.current;
    if (!container || !featured.length) return;

    let settleTimer: number | undefined;

    const updateActiveSlide = () => {
      const items = Array.from(container.querySelectorAll<HTMLElement>("[data-featured-index]"));
      if (!items.length) return;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      items.forEach((item, index) => {
        const distance = Math.abs(item.offsetLeft - container.scrollLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveFeaturedIndex((previous) => (previous === closestIndex ? previous : closestIndex));
    };

    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(updateActiveSlide, 70);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    updateActiveSlide();

    return () => {
      container.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimer);
    };
  }, [featured.length]);

  useEffect(() => {
    if (featured.length <= 1 || isCarouselPaused) return;

    const timer = window.setInterval(() => {
      goToFeatured(activeFeaturedIndex + 1, false);
    }, AUTO_SLIDE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [featured.length, activeFeaturedIndex, isCarouselPaused]);

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = new URLSearchParams();
    if (location.trim()) query.set("city", location.trim());
    if (propertyType) query.set("propertyType", propertyType);
    if (maxPrice.trim()) query.set("maxPrice", maxPrice.trim());

    navigate(`/properties?${query.toString()}`);
  }

  function pauseCarouselTemporarily() {
    setIsCarouselPaused(true);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setIsCarouselPaused(false);
    }, RESUME_AFTER_MS);
  }

  function goToFeatured(index: number, shouldPause = true) {
    if (!featured.length) return;

    const normalized = (index + featured.length) % featured.length;
    setActiveFeaturedIndex(normalized);

    const container = featuredScrollRef.current;
    const target = container?.querySelector<HTMLElement>(`[data-featured-index=\"${normalized}\"]`);
    target?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });

    if (shouldPause) {
      pauseCarouselTemporarily();
    }
  }

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Stay-inspired property browsing</p>
            <h1>Discover homes with an Airbnb-like browsing experience.</h1>
            <p>
              Browse faster with compact cards, flexible filters, and instant booking inquiry flow for every listing.
            </p>
            <div className="hero-actions">
              <Link className="cta-btn" to="/properties">
                Start Exploring
              </Link>
              <Link className="ghost-btn" to="/properties?intent=viewing">
                Book a Viewing
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <img src={HERO_IMAGE} alt="Cozy interior" />
            <div className="hero-float-card">
              <p>Fresh listings today</p>
              <strong>120+</strong>
              <span>compact, filter-first browsing</span>
            </div>
          </div>
        </div>

        <div className="container">
          <form className="hero-search" onSubmit={onSearch}>
            <label>
              Where
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or barangay"
              />
            </label>
            <label>
              Property type
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
              Max budget
              <input
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder="e.g. 7000000"
                inputMode="numeric"
              />
            </label>
            <button type="submit">Search</button>
          </form>
        </div>

        <div className="container category-strip" id="about">
          <span>Entire homes</span>
          <span>Condos</span>
          <span>City center</span>
          <span>Near schools</span>
          <span>Investment ready</span>
          <span>Family friendly</span>
        </div>
      </section>

      <section className="section trust-section">
        <div className="container trust-strip">
          <article>
            <strong>Mobile first</strong>
            <p>Optimized spacing and controls for thumb-friendly navigation.</p>
          </article>
          <article>
            <strong>Fast response</strong>
            <p>Booking and inquiry requests go directly to admin for follow-up.</p>
          </article>
          <article>
            <strong>Always updated</strong>
            <p>Listing status is managed in real time by your team.</p>
          </article>
        </div>
      </section>

      <section className="section listings-section" id="services">
        <div className="container section-head">
          <div>
            <p className="eyebrow">Trending now</p>
            <h2>Popular Listings</h2>
          </div>
          <Link to="/properties">Browse all</Link>
        </div>

        {error && <p className="container form-message error">{error}</p>}
        {isLoading ? (
          <p className="container muted">Loading featured listings...</p>
        ) : featured.length ? (
          <div className="container featured-carousel">
            <div className="carousel-controls">
              <p className="carousel-hint">Swipe to explore</p>
              <div className="carousel-actions">
                <button
                  type="button"
                  className="carousel-btn"
                  onClick={() => goToFeatured(activeFeaturedIndex - 1)}
                  aria-label="Previous featured listing"
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="carousel-btn"
                  onClick={() => goToFeatured(activeFeaturedIndex + 1)}
                  aria-label="Next featured listing"
                >
                  Next
                </button>
              </div>
            </div>

            <div
              className="featured-scroll"
              ref={featuredScrollRef}
              onTouchStart={pauseCarouselTemporarily}
              onMouseDown={pauseCarouselTemporarily}
              onWheel={pauseCarouselTemporarily}
            >
              {featured.map((property, index) => (
                <div
                  className={`featured-item ${index === activeFeaturedIndex ? "active" : ""}`}
                  key={property.id}
                  data-featured-index={index}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>

            {featured.length > 1 ? (
              <div className="carousel-dots" aria-label="Featured listing slide indicators">
                {featured.map((property, index) => (
                  <button
                    key={property.id}
                    type="button"
                    className={`carousel-dot ${index === activeFeaturedIndex ? "active" : ""}`}
                    onClick={() => goToFeatured(index)}
                    aria-label={`Go to featured listing ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="container muted">No featured listings yet.</p>
        )}
      </section>

      <section className="section section-soft" id="join">
        <div className="container split-banner">
          <div>
            <h3>Partner Developers</h3>
            <p>Trusted collaborations with local and national property developers.</p>
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
              "The booking process felt very easy on mobile, and we got confirmation quickly."
            </blockquote>
            <p>- Paula R., renter</p>
          </div>
        </div>
      </section>

      <section className="section" id="news">
        <div className="container section-head">
          <div>
            <p className="eyebrow">Recently added</p>
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

      <section className="section section-soft" id="contact">
        <div className="container cta-band">
          <h3>Need a fast viewing schedule?</h3>
          <p>Choose a listing and send a booking request in less than a minute.</p>
          <div className="cta-row">
            <Link className="cta-btn" to="/properties">
              Browse Listings
            </Link>
            <Link className="ghost-btn" to="/properties?intent=viewing">
              Book a Viewing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
