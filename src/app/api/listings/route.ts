import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const listingSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  category: z.enum(["STAY", "VEHICLE", "EVENT", "SERVICE"]),
  price: z.number().positive(),
  location: z.object({
    address: z.string(),
    city: z.string(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  maxGuests: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
      status: "APPROVED",
    };

    if (category) where.category = category;
    if (city) where.location = { path: ["city"], equals: city };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const listingsWithRating = listings.map((listing) => ({
      ...listing,
      averageRating: listing.reviews.length > 0
        ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) / listing.reviews.length
        : null,
      reviewCount: listing.reviews.length,
    }));

    return NextResponse.json(listingsWithRating);
  } catch (error) {
    console.error("GET /api/listings error:", error);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const provider = await prisma.provider.findFirst({
      where: { userId: user.id },
    });

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = listingSchema.parse(body);

    const listing = await prisma.listing.create({
      data: {
        ...validatedData,
        providerId: provider.id,
        status: "PENDING",
        images: validatedData.images || [],
        amenities: validatedData.amenities || [],
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/listings error:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
