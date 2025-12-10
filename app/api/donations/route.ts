import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const points = await prisma.donationPoint.findMany();
        return NextResponse.json(points);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch donation points' }, { status: 500 });
    }


}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const point = await prisma.donationPoint.create({
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
        return NextResponse.json(point, { status: 201 });
    } catch (error) {
        console.error('Error creating donation point:', error);
        return NextResponse.json(
            { error: 'Failed to create donation point' },
            { status: 500 }
        );
    }
}
