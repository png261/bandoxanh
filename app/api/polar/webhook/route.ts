import { headers } from 'next/headers';
import { polar } from '@/lib/polar';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Webhook, WebhookRequiredHeaders } from 'svix';

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();

    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;

    if (!webhookSecret) {
        return new NextResponse("Missing Webhook Secret", { status: 500 });
    }

    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
        evt = wh.verify(body, {
            "svix-id": headersList.get("svix-id") as string,
            "svix-timestamp": headersList.get("svix-timestamp") as string,
            "svix-signature": headersList.get("svix-signature") as string,
        });
    } catch (err) {
        return new NextResponse("Invalid Signature", { status: 400 });
    }

    const data = evt;

    // Event: subscription.created or subscription.active
    if (data.type === 'subscription.created' || data.type === 'subscription.active') {
        const subscription = data.data;
        const metadata = subscription.metadata;

        if (metadata && metadata.userId) {
            await prisma.user.update({
                where: { clerkId: metadata.userId },
                data: { plan: 'PRO' }
            });
            console.log(`Updated user ${metadata.userId} to PRO`);
        }
    }

    return new NextResponse('OK', { status: 200 });
}
