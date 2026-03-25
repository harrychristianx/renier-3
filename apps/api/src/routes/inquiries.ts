import { FastifyInstance } from "fastify";
import { ContactMethod, InquiryStatus, Prisma, prisma } from "@renier/db";
import { z } from "zod";

const inquiryPayloadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  message: z.string().min(10),
  preferredContact: z.nativeEnum(ContactMethod).default(ContactMethod.EMAIL),
  propertyId: z.string().nullable().optional(),
  propertyTitle: z.string().nullable().optional()
});

function normalizeNullableString(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  return String(value);
}

function normalizeInquiryPayload(input: unknown) {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;

  return {
    name: typeof raw.name === "string" ? raw.name : "",
    email: typeof raw.email === "string" ? raw.email : "",
    phone: normalizeNullableString(raw.phone),
    message: typeof raw.message === "string" ? raw.message : "",
    preferredContact: typeof raw.preferredContact === "string" ? raw.preferredContact.toUpperCase() : ContactMethod.EMAIL,
    propertyId: normalizeNullableString(raw.propertyId),
    propertyTitle: normalizeNullableString(raw.propertyTitle)
  };
}

export async function registerInquiryRoutes(app: FastifyInstance) {
  app.get("/api/inquiries", async (request) => {
    const query = request.query as { status?: string };
    const status = query.status?.toUpperCase();

    const where: Prisma.InquiryWhereInput =
      status && Object.values(InquiryStatus).includes(status as InquiryStatus)
        ? { status: status as InquiryStatus }
        : {};

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        property: {
          select: { id: true, slug: true, title: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { data: inquiries };
  });

  app.post("/api/inquiries", async (request, reply) => {
    const parsed = inquiryPayloadSchema.safeParse(normalizeInquiryPayload(request.body));

    if (!parsed.success) {
      return reply.status(400).send({ message: "Invalid inquiry payload", errors: parsed.error.flatten() });
    }

    let propertyTitle = parsed.data.propertyTitle ?? null;

    if (parsed.data.propertyId && !propertyTitle) {
      const property = await prisma.property.findUnique({
        where: { id: parsed.data.propertyId },
        select: { title: true }
      });
      propertyTitle = property?.title ?? null;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...parsed.data,
        propertyTitle
      }
    });

    return reply.status(201).send({ data: inquiry });
  });

  app.patch("/api/inquiries/:id/status", async (request, reply) => {
    const params = request.params as { id: string };
    const body = (typeof request.body === "object" && request.body !== null ? request.body : {}) as {
      status?: string;
    };

    const status = body.status?.toUpperCase();

    if (!status || !Object.values(InquiryStatus).includes(status as InquiryStatus)) {
      return reply.status(400).send({ message: "Invalid status" });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id: params.id },
      data: { status: status as InquiryStatus }
    });

    return { data: inquiry };
  });
}
