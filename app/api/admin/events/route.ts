import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Check admin authorization
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const { name, address, latitude, longitude, date, time, organizer, description, image } = body;

    // Validate required fields
    if (!name || !address || !date || !organizer) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, date, organizer' },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing coordinates: latitude and longitude are required' },
        { status: 400 }
      );
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid coordinates: latitude and longitude must be numbers' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid coordinates: out of range' },
        { status: 400 }
      );
    }

    console.log('Creating event:', {
      name,
      address,
      latitude,
      longitude,
      date,
      time: time || '09:00',
      organizer,
      description: description || '',
      image: image || '',
    });

    // Create new event
    const event = await prisma.recyclingEvent.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        date,
        time: time || '09:00',
        organizer,
        description: description || '',
        image: image || '',
      },
    });

    console.log('Event created successfully:', event);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Check admin authorization
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const events = await prisma.recyclingEvent.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { organizer: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : {},
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
