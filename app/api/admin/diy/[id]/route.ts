
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const idea = await prisma.diyIdea.findUnique({
            where: { id },
        });

        if (!idea) {
            return new NextResponse("Not Found", { status: 404 });
        }

        return NextResponse.json(idea);
    } catch (error) {
        console.error('[DIY_GET_ID]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const body = await req.json();
        const { title, description, difficulty, category, materials, steps, image, videoUrl } = body;

        const idea = await prisma.diyIdea.update({
            where: { id },
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
        console.error('[DIY_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const id = parseInt(params.id);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const idea = await prisma.diyIdea.delete({
            where: { id },
        });

        return NextResponse.json(idea);
    } catch (error) {
        console.error('[DIY_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
