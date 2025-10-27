import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Legacy admin emails - keeping for backward compatibility
// New admins should be set via isAdmin field in database
export const ADMIN_EMAILS = ['nguyenphuong2612004@gmail.com'];

export async function checkAdmin(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { email: true, isAdmin: true },
  });

  // Check both isAdmin field and legacy email list
  if (!user || (!user.isAdmin && !ADMIN_EMAILS.includes(user.email))) {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  return null; // User is admin
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true, isAdmin: true },
    });
    
    // Check both isAdmin field and legacy email list
    return user !== null && (user.isAdmin || ADMIN_EMAILS.includes(user.email));
  } catch (error) {
    return false;
  }
}

export async function getUserRole(userId: string): Promise<'admin' | 'user'> {
  const admin = await isAdmin(userId);
  return admin ? 'admin' : 'user';
}
