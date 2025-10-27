import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';

// GET all badges
export async function GET() {
  try {
    const badges = await prisma.badge.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' },
    });

    return NextResponse.json(badges);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch badges' },
      { status: 500 }
    );
  }
}

// POST - Create new badge (admin only)
export async function POST(request: NextRequest) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const { name, description, icon, color, category, qrCode } = body;

    const badge = await prisma.badge.create({
      data: {
        name,
        description,
        icon,
        color,
        category,
        qrCode: qrCode || null,
        isActive: true,
      },
    });

    return NextResponse.json(badge);
  } catch (error) {
    console.error('Error creating badge:', error);
    return NextResponse.json(
      { error: 'Failed to create badge' },
      { status: 500 }
    );
  }
}
