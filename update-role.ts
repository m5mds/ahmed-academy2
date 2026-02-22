import 'dotenv/config'
import { prisma } from './lib/db'

async function main() {
    const result = await prisma.user.updateMany({
        where: { email: 'm7md7mshoo' },
        data: { role: 'ADMIN' }
    });
    console.log(`Updated ${result.count} user(s) to ADMIN role.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
