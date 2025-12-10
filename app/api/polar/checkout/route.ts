import { polar } from '@/lib/polar';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const settingsUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { productId } = await req.json(); // We catch productId from client

        if (!productId) {
            return new NextResponse("Product ID required", { status: 400 });
        }

        // Create a checkout session using Polar
        // Docs: https://docs.polar.sh/api-reference/checkouts/create
        console.log("Creating Polar Checkout with:", {
            productId,
            successUrl: `${settingsUrl}/pricing?success=true`,
            email: user.emailAddresses[0].emailAddress
        });

        const session = await polar.checkouts.create({
            products: [productId],
            successUrl: `${settingsUrl}/pricing?success=true`,
            customerEmail: user.emailAddresses[0].emailAddress,
            metadata: {
                userId: userId,
                plan: 'PRO' // Assuming this product is PRO
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.log("[POLAR_ERROR]", error);
        const fs = require('fs');
        try {
            fs.appendFileSync('debug.log', `[${new Date().toISOString()}] ERROR: ${JSON.stringify(error, Object.getOwnPropertyNames(error))} \n`);
        } catch (e) {
            console.error("Could not write to debug log", e);
        }
        return new NextResponse("Internal Error", { status: 500 });
    }
}
