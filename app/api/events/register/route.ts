import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { eventId, status } = await request.json();

    if (!eventId || !status) {
      return NextResponse.json(
        { error: 'Event ID and status are required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual database logic when EventRegistration model is ready
    // For now, just return success
    // const prisma = new PrismaClient();
    // await prisma.eventRegistration.upsert({
    //   where: {
    //     userId_eventId: {
    //       userId: parseInt(userId),
    //       eventId: parseInt(eventId),
    //     },
    //   },
    //   create: {
    //     userId: parseInt(userId),
    //     eventId: parseInt(eventId),
    //     status,
    //   },
    //   update: {
    //     status,
    //   },
    // });

    return NextResponse.json({ 
      success: true,
      message: `Successfully ${status === 'going' ? 'registered for' : 'marked interested in'} the event`,
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Failed to register for event' },
      { status: 500 }
    );
  }
}
