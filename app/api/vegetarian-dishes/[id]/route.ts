
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = parseInt(idStr);

        if (isNaN(id)) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const dish = await prisma.vegetarianDish.findUnique({
            where: { id },
        });

        if (!dish) {
            return NextResponse.json(
                { error: 'Dish not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(dish);
    } catch (error) {
        console.error('Error fetching vegetarian dish:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dish' },
            { status: 500 }
        );
    }
}

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

        const dish = await prisma.vegetarianDish.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                image: body.image,
                tags: body.tags,
                cookTime: body.cookTime,
                servingSize: body.servingSize,
                ingredients: body.ingredients,
                recipe: body.recipe,
            },
        });

        return NextResponse.json(dish);
    } catch (error) {
        console.error('Error updating vegetarian dish:', error);
        return NextResponse.json(
            { error: 'Failed to update dish' },
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

        await prisma.vegetarianDish.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Dish deleted successfully' });
    } catch (error) {
        console.error('Error deleting vegetarian dish:', error);
        return NextResponse.json(
            { error: 'Failed to delete dish' },
            { status: 500 }
        );
    }
}
