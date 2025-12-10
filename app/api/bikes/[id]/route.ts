
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);
        const body = await request.json();

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        const bike = await prisma.bikeRental.update({
            where: { id },
            data: {
                name: body.name,
                address: body.address,
                latitude: body.latitude,
                longitude: body.longitude,
                price: body.price,
                hours: body.hours,
                instructions: body.instructions,
                terms: body.terms,
                image: body.image,
            },
        });

        return NextResponse.json(bike);
    } catch (error) {
        console.error('Error updating bike rental:', error);
        return NextResponse.json(
            { error: 'Failed to update bike rental' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
        }

        await prisma.bikeRental.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Bike rental deleted successfully' });
    } catch (error) {
        console.error('Error deleting bike rental:', error);
        return NextResponse.json(
            { error: 'Failed to delete bike rental' },
            { status: 500 }
        );
    }
}
