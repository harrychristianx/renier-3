import { prisma, ContactMethod, DealType, ListingStatus, PropertyType } from "../src";

const sampleProperties = [
  {
    slug: "uptown-modern-villa",
    title: "Uptown Modern Villa with Mountain View",
    description:
      "A contemporary 4-bedroom villa in a gated community with panoramic mountain views, private garden, and premium finishes.",
    price: 18500000,
    dealType: DealType.SALE,
    propertyType: PropertyType.HOUSE,
    status: ListingStatus.AVAILABLE,
    location: "Gran Via Street, Uptown",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: 4,
    bathrooms: 3,
    floorAreaSqm: 260,
    lotAreaSqm: 320,
    features: ["Gated community", "2-car garage", "Smart home ready", "Near schools"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    ],
    videoUrl: "https://www.youtube.com/embed/Scxs7L0vhZ4",
    mapEmbedUrl: "https://www.google.com/maps?q=Cagayan+de+Oro&output=embed",
    agentName: "Renier Delacruz",
    agentTitle: "Senior Property Specialist",
    agentPhone: "+63 917 000 1122",
    agentEmail: "renier@reniersrealestate.com",
    isFeatured: true,
    isLatest: true
  },
  {
    slug: "city-center-condo-loft",
    title: "City Center Condo Loft",
    description:
      "A stylish loft unit perfect for professionals and investors. Includes balcony, amenities access, and 24/7 security.",
    price: 4200000,
    dealType: DealType.SALE,
    propertyType: PropertyType.CONDO,
    status: ListingStatus.AVAILABLE,
    location: "Corrales Avenue",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: 2,
    bathrooms: 1,
    floorAreaSqm: 68,
    lotAreaSqm: null,
    features: ["Near malls", "Gym and pool", "Rental ready"],
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea"
    ],
    videoUrl: "https://www.youtube.com/embed/x3lypVnJ0HM",
    mapEmbedUrl: "https://www.google.com/maps?q=Corrales+Avenue+Cagayan+de+Oro&output=embed",
    agentName: "Ariane Santos",
    agentTitle: "Condo Specialist",
    agentPhone: "+63 918 210 3344",
    agentEmail: "ariane@reniersrealestate.com",
    isFeatured: true,
    isLatest: true
  },
  {
    slug: "balulang-roadside-lot",
    title: "Prime 500 sqm Roadside Lot in Balulang",
    description:
      "A high-visibility lot ideal for commercial or mixed-use development near major roads and schools.",
    price: 6800000,
    dealType: DealType.SALE,
    propertyType: PropertyType.LOT,
    status: ListingStatus.RESERVED,
    location: "Upper Balulang",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: null,
    bathrooms: null,
    floorAreaSqm: null,
    lotAreaSqm: 500,
    features: ["Roadside frontage", "Near transport", "Commercial potential"],
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa"
    ],
    videoUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Upper+Balulang+Cagayan+de+Oro&output=embed",
    agentName: "Renier Delacruz",
    agentTitle: "Senior Property Specialist",
    agentPhone: "+63 917 000 1122",
    agentEmail: "renier@reniersrealestate.com",
    isFeatured: false,
    isLatest: true
  },
  {
    slug: "nazareth-compact-apartment-rent",
    title: "Compact Apartment in Nazareth",
    description:
      "A fully furnished apartment for rent with quick access to cafes, schools, and transport routes.",
    price: 28000,
    dealType: DealType.RENT,
    propertyType: PropertyType.APARTMENT,
    status: ListingStatus.AVAILABLE,
    location: "Nazareth District",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: 1,
    bathrooms: 1,
    floorAreaSqm: 36,
    lotAreaSqm: null,
    features: ["Fully furnished", "Pet friendly", "Near transport"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858"
    ],
    videoUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Nazareth+Cagayan+de+Oro&output=embed",
    agentName: "Mika Solis",
    agentTitle: "Leasing Specialist",
    agentPhone: "+63 917 721 0098",
    agentEmail: "mika@reniersrealestate.com",
    isFeatured: true,
    isLatest: true
  },
  {
    slug: "macasandig-family-home",
    title: "Macasandig Family Home with Garden",
    description:
      "A move-in-ready 3-bedroom home with garden patio, covered parking, and secure neighborhood access.",
    price: 7600000,
    dealType: DealType.SALE,
    propertyType: PropertyType.HOUSE,
    status: ListingStatus.AVAILABLE,
    location: "Macasandig Village",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: 3,
    bathrooms: 2,
    floorAreaSqm: 140,
    lotAreaSqm: 180,
    features: ["Garden patio", "Covered parking", "Flood free area"],
    images: [
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00",
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6"
    ],
    videoUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Macasandig+Cagayan+de+Oro&output=embed",
    agentName: "Renier Delacruz",
    agentTitle: "Senior Property Specialist",
    agentPhone: "+63 917 000 1122",
    agentEmail: "renier@reniersrealestate.com",
    isFeatured: false,
    isLatest: true
  },
  {
    slug: "it-park-commercial-space",
    title: "Commercial Space Near IT Park",
    description:
      "A flexible commercial unit suitable for clinic, office, or boutique operations in a high-footfall zone.",
    price: 95000,
    dealType: DealType.RENT,
    propertyType: PropertyType.COMMERCIAL,
    status: ListingStatus.AVAILABLE,
    location: "Pueblo IT Park Access Road",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: null,
    bathrooms: 2,
    floorAreaSqm: 120,
    lotAreaSqm: null,
    features: ["High foot traffic", "Parking access", "Flexible fit-out"],
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
      "https://images.unsplash.com/photo-1462826303086-329426d1aef5"
    ],
    videoUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Pueblo+de+Oro+Cagayan+de+Oro&output=embed",
    agentName: "Chris Martin",
    agentTitle: "Commercial Consultant",
    agentPhone: "+63 918 332 7720",
    agentEmail: "chris@reniersrealestate.com",
    isFeatured: false,
    isLatest: true
  },
  {
    slug: "beach-view-condo-rent",
    title: "Beach View Condo Rental",
    description:
      "A bright condo rental with balcony view, amenity access, and easy commute to downtown establishments.",
    price: 36000,
    dealType: DealType.RENT,
    propertyType: PropertyType.CONDO,
    status: ListingStatus.AVAILABLE,
    location: "Seaside Tower, Barra",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: 2,
    bathrooms: 2,
    floorAreaSqm: 74,
    lotAreaSqm: null,
    features: ["Balcony view", "Pool and gym", "24/7 security"],
    images: [
      "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd"
    ],
    videoUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Barra+Opol&output=embed",
    agentName: "Ariane Santos",
    agentTitle: "Condo Specialist",
    agentPhone: "+63 918 210 3344",
    agentEmail: "ariane@reniersrealestate.com",
    isFeatured: true,
    isLatest: true
  },
  {
    slug: "canitoan-investment-lot",
    title: "Canitoan Investment Lot",
    description:
      "A long-term investment lot in an expanding residential area with direct road access and utility lines.",
    price: 5400000,
    dealType: DealType.SALE,
    propertyType: PropertyType.LOT,
    status: ListingStatus.AVAILABLE,
    location: "Canitoan Highway",
    city: "Cagayan de Oro",
    province: "Misamis Oriental",
    bedrooms: null,
    bathrooms: null,
    floorAreaSqm: null,
    lotAreaSqm: 420,
    features: ["Growth corridor", "Road access", "Utility ready"],
    images: [
      "https://images.unsplash.com/photo-1464146072230-91cabc968266",
      "https://images.unsplash.com/photo-1472220625704-91e1462799b2"
    ],
    videoUrl: null,
    mapEmbedUrl: "https://www.google.com/maps?q=Canitoan+Cagayan+de+Oro&output=embed",
    agentName: "Mika Solis",
    agentTitle: "Investment Advisor",
    agentPhone: "+63 917 721 0098",
    agentEmail: "mika@reniersrealestate.com",
    isFeatured: false,
    isLatest: true
  }
];

async function main() {
  for (const property of sampleProperties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: property,
      create: property
    });
  }

  const anyProperty = await prisma.property.findFirst();

  if (anyProperty) {
    await prisma.inquiry.create({
      data: {
        name: "Jamie Cruz",
        email: "jamie.c@example.com",
        phone: "+63 915 778 1122",
        message: "I want to schedule a weekend viewing for this property.",
        preferredContact: ContactMethod.PHONE,
        propertyId: anyProperty.id,
        propertyTitle: anyProperty.title
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
