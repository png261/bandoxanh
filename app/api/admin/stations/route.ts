import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  // Check admin authorization
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const body = await request.json();
    const { name, address, latitude, longitude, hours, wasteTypes, image } = body;

    // Validate required fields
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, latitude, longitude' },
        { status: 400 }
      );
    }

    // Validate coordinates
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

    // Convert wasteTypes array to comma-separated string
    const wasteTypesString = Array.isArray(wasteTypes) 
      ? wasteTypes.join(', ') 
      : wasteTypes || '';

    console.log('Creating station:', {
      name,
      address,
      latitude,
      longitude,
      hours: hours || 'Thứ 2 - Chủ nhật: 8:00 - 17:00',
      wasteTypes: wasteTypesString,
      image: image || '',
    });

    // Create new station
    const station = await prisma.station.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        hours: hours || 'Thứ 2 - Chủ nhật: 8:00 - 17:00',
        wasteTypes: wasteTypesString,
        image: image || '', // Default to empty string if no image provided
      },
    });

    console.log('Station created successfully:', station);

    return NextResponse.json(station, { status: 201 });
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create station',
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

    const stations = await prisma.station.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
          { wasteTypes: { contains: search, mode: 'insensitive' } },
        ],
      } : {},
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stations' },
      { status: 500 }
    );
  }
}
