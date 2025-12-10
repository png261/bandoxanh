
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const dishes = await prisma.vegetarianDish.findMany({
            orderBy: { id: 'asc' },
        });
        return NextResponse.json(dishes);
    } catch (error) {
        console.error('Error fetching vegetarian dishes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dishes' },
            { status: 500 }
        );
    }


}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const dish = await prisma.vegetarianDish.create({
            data: {
                name: body.name,
                description: body.description,
                image: body.image,
                tags: body.tags || [],
                cookTime: body.cookTime,
                servingSize: body.servingSize,
                ingredients: body.ingredients || [],
                recipe: body.recipe,
            },
        });
        return NextResponse.json(dish, { status: 201 });
    } catch (error) {
        console.error('Error creating vegetarian dish:', error);
        return NextResponse.json(
            { error: 'Failed to create dish' },
            { status: 500 }
        );
    }
}
