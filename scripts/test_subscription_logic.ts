import { prisma } from '../lib/prisma';
import { checkAndIncrementAIUsage } from '../lib/aiUsage';

async function main() {
    console.log('🧪 Starting Billing Logic Verification...');

    // 1. Setup Test User
    const testClerkId = 'test_user_billing_' + Date.now();
    console.log(`Creating test user: ${testClerkId}`);

    await prisma.user.create({
        data: {
            clerkId: testClerkId,
            email: `${testClerkId}@example.com`,
            plan: 'FREE',
            aiUsageCount: 0,
            lastUsageReset: new Date(),
        }
    });

    try {
        // 2. Test Free Limit (2 requests)
        console.log('\n--- Testing FREE Plan (Limit: 2) ---');

        // Request 1
        let result = await checkAndIncrementAIUsage(testClerkId);
        console.log(`Req 1: Allowed=${result.allowed}, Usage=${result.usage}`);
        if (!result.allowed) throw new Error('Req 1 failed unexpectedly');

        // Request 2
        result = await checkAndIncrementAIUsage(testClerkId);
        console.log(`Req 2: Allowed=${result.allowed}, Usage=${result.usage}`);
        if (!result.allowed) throw new Error('Req 2 failed unexpectedly');

        // Request 3 (Should fail)
        result = await checkAndIncrementAIUsage(testClerkId);
        console.log(`Req 3: Allowed=${result.allowed} (Expected: false)`);
        if (result.allowed) throw new Error('Req 3 should have been blocked!');

        // 3. Upgrade to PRO
        console.log('\n--- Upgrading to PRO ---');
        await prisma.user.update({
            where: { clerkId: testClerkId },
            data: { plan: 'PRO' }
        });
        console.log('User upgraded to PRO.');

        // 4. Test Pro Limit (Should allow 3rd request now)
        console.log('\n--- Testing PRO Plan ---');
        result = await checkAndIncrementAIUsage(testClerkId);
        console.log(`Req 4: Allowed=${result.allowed}, Usage=${result.usage} (Expected: true)`);
        if (!result.allowed) throw new Error('Req 4 (Pro) failed unexpectedly');

        console.log('\n✅ VERIFICATION SUCCESSFUL: Billing logic works as expected.');

    } catch (error) {
        console.error('\n❌ VERIFICATION FAILED:', error);
        process.exit(1);
    } finally {
        // Cleanup
        await prisma.user.delete({ where: { clerkId: testClerkId } });
        console.log('\nTest user cleaned up.');
        await prisma.$disconnect();
    }
}

main();
