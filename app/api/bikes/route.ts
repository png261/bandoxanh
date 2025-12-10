import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Force reload

export async function GET() {
    try {
        const bikes = await prisma.bikeRental.findMany();
        return NextResponse.json(bikes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch bike rentals' }, { status: 500 });
    }


}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const bike = await prisma.bikeRental.create({
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
        return NextResponse.json(bike, { status: 201 });
    } catch (error) {
        console.error('Error creating bike rental:', error);
        return NextResponse.json(
            { error: 'Failed to create bike rental' },
            { status: 500 }
        );
    }
}
