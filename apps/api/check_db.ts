
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Connecting to database...');
    const count = await prisma.marketplaceJob.count();
    console.log(`Successfully connected. Found ${count} jobs.`);

    const job = await prisma.marketplaceJob.findFirst({
      include: { company: true }
    });
    console.log('Sample job:', job ? job.title : 'None');

  } catch (error) {
    console.error('DB Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
