import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist in database, try to find by email or create them
    if (!user) {
      const clerkUser = await currentUser();
      
      if (!clerkUser) {
        return NextResponse.json({ error: 'Clerk user not found' }, { status: 404 });
      }

      const email = clerkUser.emailAddresses[0]?.emailAddress || '';
      const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User';
      const avatar = clerkUser.imageUrl || '';

      // Try to find existing user by email and update clerkId
      const existingUser = await prisma.user.findUnique({
        where: { email },
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
        });
      }
    }

    return NextResponse.json({
      clerkUserId: userId,
      dbUser: user,
      isAdmin: user?.isAdmin || false,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
