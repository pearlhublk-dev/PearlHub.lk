import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookingSchema = z.object({
  listingId: z.string().uuid(),
  checkIn: z.string().datetime(),
  checkOut: z.string().datetime(),
  adults: z.number().min(1).default(1),
  children: z.number().min(0).default(0),
  totalAmount: z.number().positive(),
  specialRequests: z.string().optional(),
});

export async function GET(_request: NextRequest) {
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

    const bookings = await prisma.booking.findMany({
      where: {
        guestId: user.id,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            images: true,
            type: true,
            basePrice: true,
            address: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
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

    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const listing = await prisma.listing.findUnique({
      where: { id: validatedData.listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const checkIn = new Date(validatedData.checkIn);
    const checkOut = new Date(validatedData.checkOut);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId: validatedData.listingId,
        status: { not: "CANCELLED_BY_GUEST" },
        AND: [
          { checkIn: { lte: checkOut } },
          { checkOut: { gte: checkIn } },
        ],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Listing not available for selected dates" },
        { status: 409 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        listingId: validatedData.listingId,
        guestId: user.id,
        providerId: listing.providerId,
        checkIn,
        checkOut,
        duration: Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
        adults: validatedData.adults,
        children: validatedData.children,
        basePrice: listing.basePrice,
        serviceFee: 0,
        taxAmount: 0,
        totalAmount: validatedData.totalAmount,
        status: "PENDING",
        paymentStatus: "PENDING",
        specialRequests: validatedData.specialRequests,
      },
      include: {
        listing: {
          select: {
            title: true,
            images: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
