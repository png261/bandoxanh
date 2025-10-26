import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stations = await prisma.station.findMany({
      orderBy: { createdAt: 'desc' },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const station = await prisma.station.create({
      data: {
        name: body.name,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        hours: body.hours,
        wasteTypes: JSON.stringify(body.wasteTypes || []),
        image: body.image,
      },
    });
    return NextResponse.json(station, { status: 201 });
  } catch (error) {
    console.error('Error creating station:', error);
    return NextResponse.json(
      { error: 'Failed to create station' },
      { status: 500 }
    );
  }
}
