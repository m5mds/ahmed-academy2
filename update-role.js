const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.user.updateMany({
        where: { email: 'm7md7mshoo' },
        data: { role: 'ADMIN' }
    });
    console.log(`Updated ${result.count} user(s) to ADMIN role.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
