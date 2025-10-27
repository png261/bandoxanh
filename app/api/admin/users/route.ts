import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log('[Admin Users API] Auth userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

        // Check if current user is admin in database (no Clerk API call needed)
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true } as any,
    }) as { isAdmin: boolean } | null;
    
    console.log('[Admin Users API] Current user:', currentUser);

    if (!currentUser?.isAdmin) {
      console.log('[Admin Users API] User is not admin');
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // Get all users with admin status from database only
    const users = await prisma.user.findMany({
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        avatar: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    }) as any[];
    
    console.log('[Admin Users API] Fetched users count:', users.length);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// PATCH - Update user admin status
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    console.log('[Admin Users PATCH] Auth userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin in database (no Clerk API call needed)
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAdmin: true, id: true } as any,
    }) as { isAdmin: boolean; id: number } | null;
    
    console.log('[Admin Users PATCH] Current user:', currentUser);

    if (!currentUser?.isAdmin) {
      console.log('[Admin Users PATCH] User is not admin');
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    const body = await request.json();
    const { targetUserId, isAdmin } = body;
    console.log('[Admin Users PATCH] Request body:', { targetUserId, isAdmin });

    if (!targetUserId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Prevent admin from removing their own admin status
    if (currentUser.id === targetUserId && !isAdmin) {
      return NextResponse.json({ 
        error: 'Bạn không thể xóa quyền admin của chính mình' 
      }, { status: 400 });
    }

    console.log('[Admin Users PATCH] Updating user:', targetUserId, 'to admin:', isAdmin);

    // Update user admin status
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { isAdmin } as any,
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        avatar: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      } as any,
    }) as any;
    
    console.log('[Admin Users PATCH] Updated user:', updatedUser);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user admin status:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
