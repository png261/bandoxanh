import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkId } = await auth();
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

    // Count followers and following
    const followersCount = await prisma.userFollow.count({
      where: { followingId: user.id },
    });

    const followingCount = await prisma.userFollow.count({
      where: { followerId: user.id },
    });

    // Check if current user is following this user
    let isFollowing = false;
    if (clerkId) {
      const currentUser = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (currentUser && currentUser.id !== user.id) {
        const follow = await prisma.userFollow.findUnique({
          where: {
            followerId_followingId: {
              followerId: currentUser.id,
              followingId: user.id,
            },
          },
        });
        isFollowing = !!follow;
      }
    }

    return NextResponse.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      joinDate: user.createdAt.toISOString(),
      followersCount,
      followingCount,
      isFollowing,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}
