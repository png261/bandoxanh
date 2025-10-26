import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const events = await prisma.recyclingEvent.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Transform image field to imageUrl for frontend consistency
    const transformedEvents = events.map(event => ({
      ...event,
      imageUrl: event.image,
    }));
    
    return NextResponse.json(transformedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await prisma.recyclingEvent.create({
      data: {
        name: body.name,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        date: body.date,
        time: body.time,
        organizer: body.organizer,
        description: body.description,
        image: body.image,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
