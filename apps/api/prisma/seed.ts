import { PrismaClient, JobStatus, JobLevel, JobStage } from '@prisma/client';

const prisma = new PrismaClient();

const COMPANIES = [
  { name: 'Google', website: 'https://google.com', logoUrl: 'https://logo.clearbit.com/google.com' },
  { name: 'Meta', website: 'https://meta.com', logoUrl: 'https://logo.clearbit.com/meta.com' },
  { name: 'Stripe', website: 'https://stripe.com', logoUrl: 'https://logo.clearbit.com/stripe.com' },
  { name: 'Notion', website: 'https://notion.so', logoUrl: 'https://logo.clearbit.com/notion.so' },
  { name: 'Amazon', website: 'https://amazon.com', logoUrl: 'https://logo.clearbit.com/amazon.com' },
  { name: 'Datadog', website: 'https://datadoghq.com', logoUrl: 'https://logo.clearbit.com/datadoghq.com' },
  { name: 'Vercel', website: 'https://vercel.com', logoUrl: 'https://logo.clearbit.com/vercel.com' },
  { name: 'Airbnb', website: 'https://airbnb.com', logoUrl: 'https://logo.clearbit.com/airbnb.com' },
  { name: 'Netflix', website: 'https://netflix.com', logoUrl: 'https://logo.clearbit.com/netflix.com' },
  { name: 'Spotify', website: 'https://spotify.com', logoUrl: 'https://logo.clearbit.com/spotify.com' },
];

const JOB_TITLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Fullstack Developer',
  'SRE Engineer',
  'DevOps Specialist',
  'Machine Learning Engineer',
  'Data Scientist',
  'Product Manager',
  'UI/UX Designer',
];

const SKILLS = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Go', 'Rust', 'PostgreSQL', 'Redis', 'Docker',
  'Kubernetes', 'AWS', 'GCP', 'Azure', 'TensorFlow', 'PyTorch', 'Swift', 'Kotlin', 'Java', 'Spring Boot'
];

const LOCATIONS = [
  'Mountain View, CA', 'New York, NY', 'Seattle, WA', 'San Francisco, CA', 'Austin, TX', 'Remote'
];

const DESCRIPTIONS = [
  "We are looking for a highly motivated engineer to join our core team. You will be responsible for building scalable systems and working on cutting-edge technologies. Experience with distributed systems and cloud architecture is a plus.",
  "Join our frontend team to build beautiful and intuitive user interfaces. You will work closely with designers and product managers to deliver a world-class experience to our users. Proficiency in React and modern CSS is required.",
  "As a backend engineer, you will design and implement robust APIs and manage complex data models. We value clean code, performance optimization, and strong problem-solving skills.",
  "We are seeking a talented fullstack developer who can bridge the gap between frontend and backend. You will have the opportunity to work on all parts of our stack and contribute to architectural decisions.",
  "Help us build the next generation of our product. We need someone who is passionate about technology and eager to learn. You will be involved in the entire software development lifecycle."
];

async function main() {
  console.log('Seeding Jobs Marketplace...');

  // Create Companies
  for (const comp of COMPANIES) {
    await prisma.company.upsert({
      where: { name: comp.name },
      update: {},
      create: {
        name: comp.name,
        website: comp.website,
        logoUrl: comp.logoUrl,
        description: `${comp.name} is a global leader in its industry, focused on innovation and excellence.`,
      },
    });
  }

  const dbCompanies = await prisma.company.findMany();

  // Create ~200 Jobs
  const jobsToCreate = [];
  for (let i = 0; i < 180; i++) {
    const comp = dbCompanies[Math.floor(Math.random() * dbCompanies.length)];
    const title = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
    const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const level = Object.values(JobLevel)[Math.floor(Math.random() * Object.values(JobLevel).length)];
    const description = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];

    // Pick 3-6 random skills
    const numSkills = Math.floor(Math.random() * 4) + 3;
    const jobSkills = [...SKILLS].sort(() => 0.5 - Math.random()).slice(0, numSkills);

    jobsToCreate.push({
      companyId: comp.id,
      title: `${title}${Math.random() > 0.7 ? ' (L' + (Math.floor(Math.random() * 3) + 3) + ')' : ''}`,
      location: location,
      remote: location === 'Remote',
      description: description,
      skills: jobSkills,
      level: level,
      status: JobStatus.OPEN,
      applyUrl: `${comp.website}/careers`,
    });
  }

  await prisma.marketplaceJob.createMany({
    data: jobsToCreate,
  });

  console.log('Seeding completed! Generated ~180 jobs.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
