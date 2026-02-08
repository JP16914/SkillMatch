
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const jobCount = await prisma.marketplaceJob.count();
    console.log(`Marketplace jobs found: ${jobCount}`);

    if (jobCount > 0) {
      const firstJob = await prisma.marketplaceJob.findFirst({
        include: { company: true }
      });
      console.log('Sample job:', JSON.stringify(firstJob, null, 2));
    } else {
      console.log('No jobs found. Seeding is required.');
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
