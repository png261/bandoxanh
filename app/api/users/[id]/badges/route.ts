import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET user badges
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    // Find user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: id },
      include: {
        badges: {
          include: {
            badge: true,
          },
          orderBy: {
            earnedAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const badges = user.badges.map((ub) => ({
      ...ub.badge,
      earnedAt: ub.earnedAt,
      scannedAt: ub.scannedAt,
    }));

    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user badges' },
      { status: 500 }
    );
  }
}
