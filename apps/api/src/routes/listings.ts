import { FastifyInstance } from "fastify";
import { DealType, ListingStatus, Prisma, PropertyType, prisma } from "@renier/db";
import { z } from "zod";
import { serializeProperty } from "../lib/serializers.js";
import { parseBoolean, parseNumber, toArray, toSlug } from "../lib/utils.js";

const listingPayloadSchema = z.object({
  slug: z.string().min(3).optional(),
  title: z.string().min(3),
  description: z.string().min(20),
  price: z.number().int().positive(),
  currency: z.string().default("PHP"),
  dealType: z.nativeEnum(DealType),
  propertyType: z.nativeEnum(PropertyType),
  status: z.nativeEnum(ListingStatus).default(ListingStatus.AVAILABLE),
  location: z.string().min(2),
  city: z.string().min(2),
  province: z.string().nullable().optional(),
  bedrooms: z.number().int().nonnegative().nullable().optional(),
  bathrooms: z.number().int().nonnegative().nullable().optional(),
  floorAreaSqm: z.number().nonnegative().nullable().optional(),
  lotAreaSqm: z.number().nonnegative().nullable().optional(),
  features: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().nullable().optional(),
  mapEmbedUrl: z.string().nullable().optional(),
  agentName: z.string().nullable().optional(),
  agentTitle: z.string().nullable().optional(),
  agentPhone: z.string().nullable().optional(),
  agentEmail: z.string().nullable().optional(),
  isFeatured: z.boolean().default(false),
  isLatest: z.boolean().default(true)
});

function normalizeNullableNumber(value: unknown): number | null | undefined {
  if (value === "" || value === null) return null;
  const parsed = parseNumber(value);
  return parsed ?? undefined;
}

function normalizeNullableString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return String(value);
}

function normalizeListingPayload(input: unknown) {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;

  return {
    slug: typeof raw.slug === "string" ? raw.slug : undefined,
    title: typeof raw.title === "string" ? raw.title : "",
    description: typeof raw.description === "string" ? raw.description : "",
    price: parseNumber(raw.price),
    currency: typeof raw.currency === "string" ? raw.currency : "PHP",
    dealType: typeof raw.dealType === "string" ? raw.dealType.toUpperCase() : undefined,
    propertyType: typeof raw.propertyType === "string" ? raw.propertyType.toUpperCase() : undefined,
    status: typeof raw.status === "string" ? raw.status.toUpperCase() : ListingStatus.AVAILABLE,
    location: typeof raw.location === "string" ? raw.location : "",
    city: typeof raw.city === "string" ? raw.city : "",
    province: normalizeNullableString(raw.province),
    bedrooms: normalizeNullableNumber(raw.bedrooms),
    bathrooms: normalizeNullableNumber(raw.bathrooms),
    floorAreaSqm: normalizeNullableNumber(raw.floorAreaSqm),
    lotAreaSqm: normalizeNullableNumber(raw.lotAreaSqm),
    features: toArray(raw.features),
    images: toArray(raw.images),
    videoUrl: normalizeNullableString(raw.videoUrl),
    mapEmbedUrl: normalizeNullableString(raw.mapEmbedUrl),
    agentName: normalizeNullableString(raw.agentName),
    agentTitle: normalizeNullableString(raw.agentTitle),
    agentPhone: normalizeNullableString(raw.agentPhone),
    agentEmail: normalizeNullableString(raw.agentEmail),
    isFeatured: parseBoolean(raw.isFeatured) ?? false,
    isLatest: parseBoolean(raw.isLatest) ?? true
  };
}

async function createUniqueSlug(base: string, idToExclude?: string): Promise<string> {
  const normalized = toSlug(base) || `property-${Date.now()}`;
  let candidate = normalized;
  let suffix = 2;

  while (true) {
    const existing = await prisma.property.findFirst({
      where: {
        slug: candidate,
        ...(idToExclude ? { id: { not: idToExclude } } : {})
      },
      select: { id: true }
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${normalized}-${suffix}`;
    suffix += 1;
  }
}

export async function registerListingRoutes(app: FastifyInstance) {
  app.get("/api/listings", async (request) => {
    const query = request.query as Record<string, unknown>;

    const page = Math.max(parseNumber(query.page) ?? 1, 1);
    const pageSize = Math.min(Math.max(parseNumber(query.pageSize) ?? 12, 1), 50);
    const search = typeof query.search === "string" ? query.search.trim() : "";
    const city = typeof query.city === "string" ? query.city.trim() : "";
    const dealType = typeof query.dealType === "string" ? query.dealType.toUpperCase() : undefined;
    const propertyType = typeof query.propertyType === "string" ? query.propertyType.toUpperCase() : undefined;
    const status = typeof query.status === "string" ? query.status.toUpperCase() : undefined;
    const minPrice = parseNumber(query.minPrice);
    const maxPrice = parseNumber(query.maxPrice);
    const featured = parseBoolean(query.featured);
    const latest = parseBoolean(query.latest);

    const where: Prisma.PropertyWhereInput = {};

    if (city) where.city = { contains: city };
    if (dealType && Object.values(DealType).includes(dealType as DealType)) where.dealType = dealType as DealType;
    if (propertyType && Object.values(PropertyType).includes(propertyType as PropertyType)) {
      where.propertyType = propertyType as PropertyType;
    }
    if (status && Object.values(ListingStatus).includes(status as ListingStatus)) {
      where.status = status as ListingStatus;
    }
    if (featured !== undefined) where.isFeatured = featured;
    if (latest !== undefined) where.isLatest = latest;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: Math.round(minPrice) } : {}),
        ...(maxPrice !== undefined ? { lte: Math.round(maxPrice) } : {})
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
        { city: { contains: search } }
      ];
    }

    const [total, rows] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize
      })
    ]);

    return {
      data: rows.map(serializeProperty),
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize)
      }
    };
  });

  app.get("/api/listings/:slug", async (request, reply) => {
    const params = request.params as { slug: string };

    const property = await prisma.property.findFirst({
      where: {
        OR: [{ slug: params.slug }, { id: params.slug }]
      }
    });

    if (!property) {
      return reply.status(404).send({ message: "Listing not found" });
    }

    return { data: serializeProperty(property) };
  });

  app.post("/api/listings", async (request, reply) => {
    const parsed = listingPayloadSchema.safeParse(normalizeListingPayload(request.body));

    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid listing payload", errors: parsed.error.flatten() });
    }

    const payload = parsed.data;
    const slug = await createUniqueSlug(payload.slug ?? payload.title);

    const property = await prisma.property.create({
      data: {
        ...payload,
        slug,
        price: Math.round(payload.price)
      }
    });

    return reply.status(201).send({ data: serializeProperty(property) });
  });

  app.put("/api/listings/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const existing = await prisma.property.findUnique({ where: { id: params.id } });

    if (!existing) {
      return reply.status(404).send({ message: "Listing not found" });
    }

    const parsed = listingPayloadSchema.safeParse(normalizeListingPayload(request.body));

    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid listing payload", errors: parsed.error.flatten() });
    }

    const payload = parsed.data;
    const slug = await createUniqueSlug(payload.slug ?? payload.title, params.id);

    const property = await prisma.property.update({
      where: { id: params.id },
      data: {
        ...payload,
        slug,
        price: Math.round(payload.price)
      }
    });

    return { data: serializeProperty(property) };
  });

  app.patch("/api/listings/:id/status", async (request, reply) => {
    const params = request.params as { id: string };
    const body = (typeof request.body === "object" && request.body !== null ? request.body : {}) as {
      status?: string;
    };

    const status = typeof body.status === "string" ? body.status.toUpperCase() : "";

    if (!Object.values(ListingStatus).includes(status as ListingStatus)) {
      return reply.status(400).send({ message: "Invalid status" });
    }

    const property = await prisma.property.update({
      where: { id: params.id },
      data: { status: status as ListingStatus }
    });

    return { data: serializeProperty(property) };
  });

  app.delete("/api/listings/:id", async (request, reply) => {
    const params = request.params as { id: string };

    await prisma.property.delete({ where: { id: params.id } });

    return reply.status(204).send();
  });
}
