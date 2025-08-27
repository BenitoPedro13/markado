const {PrismaClient} = require('./app/generated/prisma/client/index.js');
const prisma = new PrismaClient();

const mainAppStore = require("./seed-app-store.js");

async function main() {
  // Clean the database
  await prisma.user.deleteMany();

  // Create initial users
  const users = await Promise.all([
    prisma.user.create({
      data: {name: 'Bilbo 0'}
    }),
    prisma.user.create({
      data: {name: 'Bilbo 1'}
    }),
    prisma.user.create({
      data: {name: 'Bilbo 2'}
    })
  ]);

  console.log('Seed data created:', {users});
}

main()
.then(() => mainAppStore())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
