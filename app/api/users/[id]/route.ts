import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = id;

    // Try to parse as integer first (database ID), fallback to clerkId (string)
    const parsedId = parseInt(userId, 10);
    const whereCondition = !isNaN(parsedId)
      ? { id: parsedId }
      : { clerkId: userId };

    // Find user by ID or clerkId
    const user = await prisma.user.findFirst({
      where: whereCondition,
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      joinDate: user.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
