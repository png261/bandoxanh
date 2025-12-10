
import { polar } from '@/lib/polar';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // List subscriptions for this user
        // We use the metadata.userId filter which we save during checkout
        // Note: Check SDK documentation for exact filtering syntax. 
        // Assuming list() accepts parameters.
        const subscriptions = await polar.subscriptions.list({
            // Filter by organization if needed, but here filtering by metadata is key
            // If direct metadata filtering isn't top-level, we might need to fetch all and filter (inefficient but works for small scale)
            // or query by email if Polar supports it.
            // Based on standard API: query parameters usually allow sorting/pagination. Filtering by metadata might require specific syntax.
            // Let's try to filter by email or just fetch and filter in memory if needed.
            // Actually, Polar API allows `query` arg?
        });

        // Manual filter since SDK types might vary
        // We look for active subscription
        const activeSub = subscriptions.result.items.find((sub: any) =>
            (sub.metadata?.userId === user.id || sub.user?.email === user.emailAddresses[0]?.emailAddress) &&
            sub.status === 'active'
        );

        if (activeSub) {
            return NextResponse.json({
                hasSubscription: true,
                subscription: {
                    id: activeSub.id,
                    status: activeSub.status,
                    currentPeriodEnd: activeSub.currentPeriodEnd,
                    cancelAtPeriodEnd: activeSub.cancelAtPeriodEnd
                }
            });
        }

        return NextResponse.json({ hasSubscription: false });

    } catch (error: any) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, subscriptionId } = await req.json();

        if (action === 'cancel' && subscriptionId) {
            // Cancel subscription (set cancelAtPeriodEnd to true)
            // Trying flattened approach or subscriptionUpdate based on Speakeasy
            await polar.subscriptions.update({
                id: subscriptionId,
                subscriptionUpdate: { cancelAtPeriodEnd: true }
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('Error managing subscription:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
