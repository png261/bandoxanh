import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdmin } from '@/lib/admin';

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await checkAdmin(request);
  if (adminCheck) return adminCheck;

  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await prisma.recyclingEvent.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

// PUT event (update)
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
    
    console.log('PUT /api/admin/events - Body received:', body);
    console.log('Image value:', body.imageUrl || body.image);
    
    const imageValue = body.imageUrl !== undefined ? body.imageUrl : body.image;
    
    const event = await prisma.recyclingEvent.update({
      where: { id },
      data: {
        name: body.name,
        address: body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        date: body.date,
        time: body.time,
        organizer: body.organizer,
        description: body.description,
        image: imageValue, // Use imageUrl if provided, otherwise image
      },
    });

    // Transform image field to imageUrl for frontend consistency
    const transformedEvent = {
      ...event,
      imageUrl: event.image,
    };

    return NextResponse.json(transformedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}
