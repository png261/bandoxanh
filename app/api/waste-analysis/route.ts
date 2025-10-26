import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const analyses = await prisma.wasteAnalysis.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(analyses);
  } catch (error) {
    console.error('Error fetching waste analyses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waste analyses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const analysis = await prisma.wasteAnalysis.create({
      data: {
        imageUrl: body.imageUrl,
        wasteType: body.wasteType,
        recyclingSuggestion: body.recyclingSuggestion,
      },
    });
    return NextResponse.json(analysis, { status: 201 });
  } catch (error) {
    console.error('Error creating waste analysis:', error);
    return NextResponse.json(
      { error: 'Failed to create waste analysis' },
      { status: 500 }
    );
  }
}
