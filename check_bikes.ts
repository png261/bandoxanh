import { prisma } from './lib/prisma';

async function main() {
    console.log('Checking BikeRental table...');
    try {
        const bikes = await prisma.bikeRental.findMany();
        console.log(`Found ${bikes.length} bikes.`);
        console.log(bikes);
    } catch (error) {
        console.error('Error querying BikeRental:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
