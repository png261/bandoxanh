
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const ideas = await prisma.diyIdea.findMany({
            orderBy: { id: 'asc' },
        });
        return NextResponse.json(ideas);
    } catch (error) {
        console.error('Error fetching DIY ideas:', error);
        return NextResponse.json(
            { error: 'Failed to fetch DIY ideas' },
            { status: 500 }
        );
    }
}
