import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const currentDateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Get upcoming events (events with date >= today)
    const events = await prisma.recyclingEvent.findMany({
      where: {
        date: {
          gte: currentDateStr,
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: 10, // Limit to 10 upcoming events
    });

    // TODO: Add registration counts when EventRegistration model is available
    const eventsWithCounts = events.map(event => ({
      ...event,
      interestedCount: 0,
      goingCount: 0,
      userStatus: null,
    }));

    return NextResponse.json(eventsWithCounts);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
