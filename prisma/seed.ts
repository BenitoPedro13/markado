const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Clean the database
  await prisma.user.deleteMany();

  // Create initial users
  const users = await Promise.all([
    prisma.user.create({
      data: { name: 'Bilbo 0' },
    }),
    prisma.user.create({
      data: { name: 'Bilbo 1' },
    }),
    prisma.user.create({
      data: { name: 'Bilbo 2' },
    }),
  ]);

  console.log('Seed data created:', { users });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 