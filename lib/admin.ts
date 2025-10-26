import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Admin emails - can be moved to env later
export const ADMIN_EMAILS = ['nguyenphuong2612004@gmail.com'];

export async function checkAdmin(req: NextRequest) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { email: true },
  });

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }

  return null; // User is admin
}

export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { email: true },
    });
    
    return user !== null && ADMIN_EMAILS.includes(user.email);
  } catch (error) {
    return false;
  }
}

export async function getUserRole(userId: string): Promise<'admin' | 'user'> {
  const admin = await isAdmin(userId);
  return admin ? 'admin' : 'user';
}
