
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ideas = await prisma.diyIdea.findMany({
            orderBy: { id: 'desc' },
        });
        return NextResponse.json(ideas);
    } catch (error) {
        console.error('[DIY_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, description, difficulty, category, materials, steps, image, videoUrl } = body;

        const idea = await prisma.diyIdea.create({
            data: {
                title,
                description,
                difficulty,
                category,
                materials,
                steps,
                image,
                videoUrl,
            },
        });

        return NextResponse.json(idea);
    } catch (error) {
        console.error('[DIY_POST]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
