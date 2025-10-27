import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// POST - Scan QR code and earn badge
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { qrCode } = body;

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code is required' }, { status: 400 });
    }

    // Find badge by QR code
    const badge = await prisma.badge.findUnique({
      where: { qrCode, isActive: true },
    });

    if (!badge) {
      return NextResponse.json(
        { error: 'Invalid QR code or badge not found' },
        { status: 404 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has this badge
    const existingBadge = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId: user.id,
          badgeId: badge.id,
        },
      },
    });

    if (existingBadge) {
      return NextResponse.json(
        { error: 'You already have this badge', badge },
        { status: 400 }
      );
    }

    // Award badge to user
    const userBadge = await prisma.userBadge.create({
      data: {
        userId: user.id,
        badgeId: badge.id,
        scannedAt: new Date(),
      },
      include: {
        badge: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `You earned the "${badge.name}" badge!`,
      badge: userBadge.badge,
    });
  } catch (error) {
    console.error('Error scanning QR code:', error);
    return NextResponse.json(
      { error: 'Failed to scan QR code' },
      { status: 500 }
    );
  }
}
