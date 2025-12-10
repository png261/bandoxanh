import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { plan } = await request.json();

        if (plan !== 'FREE' && plan !== 'PRO') {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // Find the user by Clerk ID
        const user = await prisma.user.findUnique({
            where: { clerkId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update the user's plan
        await prisma.user.update({
            where: { id: user.id },
            data: {
                plan: plan,
                // Reset usage count if upgrading to PRO so they get full benefit immediately? 
                // Or keep it? Let's keep it simple and just change the plan. Limit check logic handles the rest.
            },
        });

        return NextResponse.json({ success: true, plan });
    } catch (error) {
        console.error('Error updating subscription:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
