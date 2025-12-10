
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

        const point = await prisma.donationPoint.update({
            where: { id },
            data: {
                name: body.name,
                address: body.address,
                latitude: body.latitude,
                longitude: body.longitude,
                hours: body.hours,
                acceptedItems: body.acceptedItems,
                beneficiary: body.beneficiary,
                image: body.image,
                beneficiaryImage: body.beneficiaryImage,
            },
        });

        return NextResponse.json(point);
    } catch (error) {
        console.error('Error updating donation point:', error);
        return NextResponse.json(
            { error: 'Failed to update donation point' },
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

        await prisma.donationPoint.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Donation point deleted successfully' });
    } catch (error) {
        console.error('Error deleting donation point:', error);
        return NextResponse.json(
            { error: 'Failed to delete donation point' },
            { status: 500 }
        );
    }
}
