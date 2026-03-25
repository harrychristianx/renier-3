import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createInquiry, formatPrice, getListing, prettyEnum } from "../lib/api";
import type { Property } from "../lib/types";

type ContactMethod = "EMAIL" | "PHONE" | "SMS" | "WHATSAPP";

const EMPTY_INQUIRY = {
  name: "",
  email: "",
  phone: "",
  message: "",
  preferredContact: "EMAIL" as ContactMethod
};

const EMPTY_BOOKING = {
  name: "",
  email: "",
  phone: "",
  notes: "",
  preferredContact: "PHONE" as ContactMethod,
  date: "",
  time: ""
};

export function PropertyDetailPage() {
  const { slug = "" } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [inquiryForm, setInquiryForm] = useState(EMPTY_INQUIRY);
  const [bookingForm, setBookingForm] = useState(EMPTY_BOOKING);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downPayment, setDownPayment] = useState(20);
  const [interestRate, setInterestRate] = useState(7.2);
  const [loanYears, setLoanYears] = useState(20);

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);
      setError("");

      try {
        const data = await getListing(slug);
        if (!active) return;
        setProperty(data);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load listing");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [slug]);

  const mortgage = useMemo(() => {
    if (!property) return null;

    const principal = property.price * ((100 - downPayment) / 100);
    const monthlyRate = interestRate / 100 / 12;
    const months = loanYears * 12;

    if (!monthlyRate || !months) {
      return {
        principal,
        monthlyPayment: principal / Math.max(months, 1)
      };
    }

    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);

    return {
      principal,
      monthlyPayment
    };
  }, [property, downPayment, interestRate, loanYears]);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!property) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      await createInquiry({
        ...inquiryForm,
        propertyId: property.id,
        propertyTitle: property.title
      });

      setInquiryForm(EMPTY_INQUIRY);
      setFeedback("Inquiry sent. Our team will contact you shortly.");
    } catch (submitError) {
      setFeedback(submitError instanceof Error ? submitError.message : "Unable to send inquiry");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!property) return;

    setIsSubmitting(true);
    setFeedback("");

    try {
      await createInquiry({
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        preferredContact: bookingForm.preferredContact,
        propertyId: property.id,
        propertyTitle: property.title,
        message:
          `Book a viewing request for ${property.title}. Preferred schedule: ${bookingForm.date} ${bookingForm.time}. ` +
          bookingForm.notes
      });

      setFeedback("Viewing request submitted. We will confirm your schedule soon.");
      setBookingForm(EMPTY_BOOKING);
    } catch (submitError) {
      setFeedback(submitError instanceof Error ? submitError.message : "Unable to submit booking");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="muted">Loading listing details...</p>
        </div>
      </section>
    );
  }

  if (error || !property) {
    return (
      <section className="section">
        <div className="container">
          <p className="form-message error">{error || "Listing not found"}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container detail-layout">
        <article>
          <p className="eyebrow">
            {prettyEnum(property.dealType)} • {prettyEnum(property.propertyType)} • {prettyEnum(property.status)}
          </p>
          <h1>{property.title}</h1>
          <p className="card-location">
            {property.location}, {property.city}
            {property.province ? `, ${property.province}` : ""}
          </p>
          <p className="detail-price">{formatPrice(property.price, property.currency)}</p>

          <div className="gallery-grid">
            {(property.images.length ? property.images : ["https://images.unsplash.com/photo-1560185007-cde436f6a4d0"]).map(
              (image, index) => (
                <img key={image + index} src={image} alt={`${property.title} ${index + 1}`} />
              )
            )}
          </div>

          <p>{property.description}</p>

          <div className="tag-row">
            <span>{property.bedrooms ?? "-"} Bedrooms</span>
            <span>{property.bathrooms ?? "-"} Bathrooms</span>
            <span>{property.floorAreaSqm ?? "-"} Floor sqm</span>
            <span>{property.lotAreaSqm ?? "-"} Lot sqm</span>
          </div>

          <ul className="feature-list">
            {property.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          {property.mapEmbedUrl ? (
            <iframe className="embed-frame" loading="lazy" src={property.mapEmbedUrl} title="Map location" />
          ) : null}

          {property.videoUrl ? (
            <iframe className="embed-frame" loading="lazy" src={property.videoUrl} title="Property video" />
          ) : null}
        </article>

        <aside className="detail-sidebar">
          <section className="panel">
            <h3>Mortgage Calculator</h3>
            <label>
              Down Payment (%)
              <input
                type="number"
                value={downPayment}
                min={0}
                max={99}
                onChange={(event) => setDownPayment(Number(event.target.value))}
              />
            </label>
            <label>
              Interest Rate (Annual %)
              <input
                type="number"
                value={interestRate}
                min={0}
                step="0.1"
                onChange={(event) => setInterestRate(Number(event.target.value))}
              />
            </label>
            <label>
              Loan Term (Years)
              <input
                type="number"
                min={1}
                value={loanYears}
                onChange={(event) => setLoanYears(Number(event.target.value))}
              />
            </label>

            {mortgage ? (
              <div className="calc-result">
                <p>Estimated principal: {formatPrice(mortgage.principal, property.currency)}</p>
                <p>Estimated monthly: {formatPrice(mortgage.monthlyPayment, property.currency)}</p>
              </div>
            ) : null}
          </section>

          <section className="panel">
            <h3>Quick Inquiry</h3>
            <form className="form-stack" onSubmit={submitInquiry}>
              <input
                required
                placeholder="Full name"
                value={inquiryForm.name}
                onChange={(event) => setInquiryForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={inquiryForm.email}
                onChange={(event) => setInquiryForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                placeholder="Phone"
                value={inquiryForm.phone}
                onChange={(event) => setInquiryForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <select
                value={inquiryForm.preferredContact}
                onChange={(event) =>
                  setInquiryForm((prev) => ({ ...prev, preferredContact: event.target.value as ContactMethod }))
                }
              >
                <option value="EMAIL">Email</option>
                <option value="PHONE">Phone</option>
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
              <textarea
                required
                rows={4}
                placeholder="Tell us what you need"
                value={inquiryForm.message}
                onChange={(event) => setInquiryForm((prev) => ({ ...prev, message: event.target.value }))}
              />
              <button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </section>

          <section className="panel">
            <h3>Book a Viewing</h3>
            <form className="form-stack" onSubmit={submitBooking}>
              <input
                required
                placeholder="Full name"
                value={bookingForm.name}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, name: event.target.value }))}
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={bookingForm.email}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              <input
                placeholder="Phone"
                value={bookingForm.phone}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
              <select
                value={bookingForm.preferredContact}
                onChange={(event) =>
                  setBookingForm((prev) => ({ ...prev, preferredContact: event.target.value as ContactMethod }))
                }
              >
                <option value="PHONE">Phone</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, date: event.target.value }))}
                required
              />
              <input
                type="time"
                value={bookingForm.time}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, time: event.target.value }))}
                required
              />
              <textarea
                rows={3}
                placeholder="Additional notes"
                value={bookingForm.notes}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, notes: event.target.value }))}
              />
              <button disabled={isSubmitting} type="submit">
                {isSubmitting ? "Submitting..." : "Submit Viewing Request"}
              </button>
            </form>
          </section>

          {property.agentName ? (
            <section className="panel">
              <h3>Agent Profile</h3>
              <p>{property.agentName}</p>
              {property.agentTitle ? <p>{property.agentTitle}</p> : null}
              {property.agentPhone ? <p>{property.agentPhone}</p> : null}
              {property.agentEmail ? <p>{property.agentEmail}</p> : null}
            </section>
          ) : null}

          {feedback ? <p className="form-message">{feedback}</p> : null}
        </aside>
      </div>
    </section>
  );
}