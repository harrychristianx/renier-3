import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { createInquiry, formatPrice, getListing, prettyEnum } from "../lib/api";
const EMPTY_INQUIRY = {
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredContact: "EMAIL"
};
const EMPTY_BOOKING = {
    name: "",
    email: "",
    phone: "",
    notes: "",
    preferredContact: "PHONE",
    date: "",
    time: ""
};
export function PropertyDetailPage() {
    const { slug = "" } = useParams();
    const [property, setProperty] = useState(null);
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
                if (!active)
                    return;
                setProperty(data);
            }
            catch (loadError) {
                if (active) {
                    setError(loadError instanceof Error ? loadError.message : "Unable to load listing");
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
    }, [slug]);
    const mortgage = useMemo(() => {
        if (!property)
            return null;
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
    async function submitInquiry(event) {
        event.preventDefault();
        if (!property)
            return;
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
        }
        catch (submitError) {
            setFeedback(submitError instanceof Error ? submitError.message : "Unable to send inquiry");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    async function submitBooking(event) {
        event.preventDefault();
        if (!property)
            return;
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
                message: `Book a viewing request for ${property.title}. Preferred schedule: ${bookingForm.date} ${bookingForm.time}. ` +
                    bookingForm.notes
            });
            setFeedback("Viewing request submitted. We will confirm your schedule soon.");
            setBookingForm(EMPTY_BOOKING);
        }
        catch (submitError) {
            setFeedback(submitError instanceof Error ? submitError.message : "Unable to submit booking");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    if (isLoading) {
        return (_jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsx("p", { className: "muted", children: "Loading listing details..." }) }) }));
    }
    if (error || !property) {
        return (_jsx("section", { className: "section", children: _jsx("div", { className: "container", children: _jsx("p", { className: "form-message error", children: error || "Listing not found" }) }) }));
    }
    return (_jsx("section", { className: "section", children: _jsxs("div", { className: "container detail-layout", children: [_jsxs("article", { children: [_jsxs("p", { className: "eyebrow", children: [prettyEnum(property.dealType), " \uFFFD ", prettyEnum(property.propertyType), " \uFFFD ", prettyEnum(property.status)] }), _jsx("h1", { children: property.title }), _jsxs("p", { className: "card-location", children: [property.location, ", ", property.city, property.province ? `, ${property.province}` : ""] }), _jsx("p", { className: "detail-price", children: formatPrice(property.price, property.currency) }), _jsx("div", { className: "gallery-grid", children: (property.images.length ? property.images : ["https://images.unsplash.com/photo-1560185007-cde436f6a4d0"]).map((image, index) => (_jsx("img", { src: image, alt: `${property.title} ${index + 1}` }, image + index))) }), _jsx("p", { children: property.description }), _jsxs("div", { className: "tag-row", children: [_jsxs("span", { children: [property.bedrooms ?? "-", " Bedrooms"] }), _jsxs("span", { children: [property.bathrooms ?? "-", " Bathrooms"] }), _jsxs("span", { children: [property.floorAreaSqm ?? "-", " Floor sqm"] }), _jsxs("span", { children: [property.lotAreaSqm ?? "-", " Lot sqm"] })] }), _jsx("ul", { className: "feature-list", children: property.features.map((feature) => (_jsx("li", { children: feature }, feature))) }), property.mapEmbedUrl ? (_jsx("iframe", { className: "embed-frame", loading: "lazy", src: property.mapEmbedUrl, title: "Map location" })) : null, property.videoUrl ? (_jsx("iframe", { className: "embed-frame", loading: "lazy", src: property.videoUrl, title: "Property video" })) : null] }), _jsxs("aside", { className: "detail-sidebar", children: [_jsxs("section", { className: "panel", children: [_jsx("h3", { children: "Mortgage Calculator" }), _jsxs("label", { children: ["Down Payment (%)", _jsx("input", { type: "number", value: downPayment, min: 0, max: 99, onChange: (event) => setDownPayment(Number(event.target.value)) })] }), _jsxs("label", { children: ["Interest Rate (Annual %)", _jsx("input", { type: "number", value: interestRate, min: 0, step: "0.1", onChange: (event) => setInterestRate(Number(event.target.value)) })] }), _jsxs("label", { children: ["Loan Term (Years)", _jsx("input", { type: "number", min: 1, value: loanYears, onChange: (event) => setLoanYears(Number(event.target.value)) })] }), mortgage ? (_jsxs("div", { className: "calc-result", children: [_jsxs("p", { children: ["Estimated principal: ", formatPrice(mortgage.principal, property.currency)] }), _jsxs("p", { children: ["Estimated monthly: ", formatPrice(mortgage.monthlyPayment, property.currency)] })] })) : null] }), _jsxs("section", { className: "panel", children: [_jsx("h3", { children: "Quick Inquiry" }), _jsxs("form", { className: "form-stack", onSubmit: submitInquiry, children: [_jsx("input", { required: true, placeholder: "Full name", value: inquiryForm.name, onChange: (event) => setInquiryForm((prev) => ({ ...prev, name: event.target.value })) }), _jsx("input", { required: true, type: "email", placeholder: "Email", value: inquiryForm.email, onChange: (event) => setInquiryForm((prev) => ({ ...prev, email: event.target.value })) }), _jsx("input", { placeholder: "Phone", value: inquiryForm.phone, onChange: (event) => setInquiryForm((prev) => ({ ...prev, phone: event.target.value })) }), _jsxs("select", { value: inquiryForm.preferredContact, onChange: (event) => setInquiryForm((prev) => ({ ...prev, preferredContact: event.target.value })), children: [_jsx("option", { value: "EMAIL", children: "Email" }), _jsx("option", { value: "PHONE", children: "Phone" }), _jsx("option", { value: "SMS", children: "SMS" }), _jsx("option", { value: "WHATSAPP", children: "WhatsApp" })] }), _jsx("textarea", { required: true, rows: 4, placeholder: "Tell us what you need", value: inquiryForm.message, onChange: (event) => setInquiryForm((prev) => ({ ...prev, message: event.target.value })) }), _jsx("button", { disabled: isSubmitting, type: "submit", children: isSubmitting ? "Sending..." : "Send Inquiry" })] })] }), _jsxs("section", { className: "panel", children: [_jsx("h3", { children: "Book a Viewing" }), _jsxs("form", { className: "form-stack", onSubmit: submitBooking, children: [_jsx("input", { required: true, placeholder: "Full name", value: bookingForm.name, onChange: (event) => setBookingForm((prev) => ({ ...prev, name: event.target.value })) }), _jsx("input", { required: true, type: "email", placeholder: "Email", value: bookingForm.email, onChange: (event) => setBookingForm((prev) => ({ ...prev, email: event.target.value })) }), _jsx("input", { placeholder: "Phone", value: bookingForm.phone, onChange: (event) => setBookingForm((prev) => ({ ...prev, phone: event.target.value })) }), _jsxs("select", { value: bookingForm.preferredContact, onChange: (event) => setBookingForm((prev) => ({ ...prev, preferredContact: event.target.value })), children: [_jsx("option", { value: "PHONE", children: "Phone" }), _jsx("option", { value: "EMAIL", children: "Email" }), _jsx("option", { value: "SMS", children: "SMS" }), _jsx("option", { value: "WHATSAPP", children: "WhatsApp" })] }), _jsx("input", { type: "date", value: bookingForm.date, onChange: (event) => setBookingForm((prev) => ({ ...prev, date: event.target.value })), required: true }), _jsx("input", { type: "time", value: bookingForm.time, onChange: (event) => setBookingForm((prev) => ({ ...prev, time: event.target.value })), required: true }), _jsx("textarea", { rows: 3, placeholder: "Additional notes", value: bookingForm.notes, onChange: (event) => setBookingForm((prev) => ({ ...prev, notes: event.target.value })) }), _jsx("button", { disabled: isSubmitting, type: "submit", children: isSubmitting ? "Submitting..." : "Submit Viewing Request" })] })] }), property.agentName ? (_jsxs("section", { className: "panel", children: [_jsx("h3", { children: "Agent Profile" }), _jsx("p", { children: property.agentName }), property.agentTitle ? _jsx("p", { children: property.agentTitle }) : null, property.agentPhone ? _jsx("p", { children: property.agentPhone }) : null, property.agentEmail ? _jsx("p", { children: property.agentEmail }) : null] })) : null, feedback ? _jsx("p", { className: "form-message", children: feedback }) : null] })] }) }));
}
