const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const blocks = await prisma.scheduleBlock.findMany();
  console.log("Blocks:", blocks);
  
  const bookings = await prisma.booking.findMany();
  console.log("Bookings:", bookings);
}

main().catch(console.error).finally(() => prisma.$disconnect());
