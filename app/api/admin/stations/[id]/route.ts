import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin';

// DELETE station
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.station.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error('Error deleting station:', error);
    return NextResponse.json(
      { error: 'Failed to delete station' },
      { status: 500 }
    );
  }
}

// PUT station (update)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    const body = await request.json();
    
    const station = await prisma.station.update({
      where: { id },
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

    return NextResponse.json(station);
  } catch (error) {
    console.error('Error updating station:', error);
    return NextResponse.json(
      { error: 'Failed to update station' },
      { status: 500 }
    );
  }
}
