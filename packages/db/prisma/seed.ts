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
    mapEmbedUrl:
      "https://www.google.com/maps?q=Cagayan+de+Oro&output=embed",
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
    mapEmbedUrl:
      "https://www.google.com/maps?q=Corrales+Avenue+Cagayan+de+Oro&output=embed",
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
    mapEmbedUrl:
      "https://www.google.com/maps?q=Upper+Balulang+Cagayan+de+Oro&output=embed",
    agentName: "Renier Delacruz",
    agentTitle: "Senior Property Specialist",
    agentPhone: "+63 917 000 1122",
    agentEmail: "renier@reniersrealestate.com",
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