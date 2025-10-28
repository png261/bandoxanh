import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        avatar: true,
      },
    });

    // If user doesn't exist in database, try to find by email or create them
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
      const avatar = clerkUser.imageUrl || '';

      // Try to find existing user by email and update clerkId
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, isAdmin: true },
      });

      if (existingUser) {
        // Update existing user with new clerkId
        user = await prisma.user.update({
          where: { email },
          data: {
            clerkId: userId,
            name,
            avatar,
          },
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            avatar: true,
          },
        });
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email,
            name,
            avatar,
            isAdmin: false,
          },
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            avatar: true,
          },
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
