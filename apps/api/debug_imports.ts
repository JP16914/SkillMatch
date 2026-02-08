
import { JobStatus, PrismaClient } from '@prisma/client';

console.log('Checking imports...');
console.log('JobStatus:', JobStatus);
console.log('JobStatus.OPEN:', JobStatus?.OPEN);

const prisma = new PrismaClient();
async function main() {
  try {
    console.log('Attempting query with enum...');
    const jobs = await prisma.marketplaceJob.findMany({
      where: { status: JobStatus.OPEN },
      take: 1
    });
    console.log('Query success. Jobs found:', jobs.length);
  } catch (e) {
    console.error('Query failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
