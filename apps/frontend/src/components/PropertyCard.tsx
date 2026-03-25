import { Link } from "react-router-dom";
import { formatPrice, prettyEnum } from "../lib/api";
import type { Property } from "../lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80";

export function PropertyCard({ property }: { property: Property }) {
  const rating = (4.7 + ((property.title.length % 4) * 0.1)).toFixed(1);

  return (
    <article className="property-card">
      <Link className="card-link-wrap" to={`/properties/${property.slug}`} aria-label={`View details for ${property.title}`}>
        <div className="card-media">
          <img src={property.images[0] ?? FALLBACK_IMAGE} alt={property.title} loading="lazy" />
          <span className={`badge badge-${property.status.toLowerCase()}`}>{prettyEnum(property.status)}</span>
        </div>

        <div className="card-body">
          <div className="card-meta-row">
            <p className="card-meta">
              {prettyEnum(property.dealType)} | {prettyEnum(property.propertyType)}
            </p>
            <p className="card-rating">* {rating}</p>
          </div>
          <h3>{property.title}</h3>
          <p className="card-location">
            {property.location}, {property.city}
          </p>
          <p className="card-price">{formatPrice(property.price, property.currency)}</p>
          <div className="card-stats">
            <span>{property.bedrooms ?? "-"} bd</span>
            <span>{property.bathrooms ?? "-"} ba</span>
            <span>{property.floorAreaSqm ?? property.lotAreaSqm ?? "-"} sqm</span>
          </div>
          <span className="inline-link">View Details</span>
        </div>
      </Link>
    </article>
  );
}
