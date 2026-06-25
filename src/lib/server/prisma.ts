import { dev } from '$app/environment';
import { PrismaClient } from '$lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '$env/static/private';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({
	connectionString: DATABASE_URL,
});

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (dev) globalForPrisma.prisma = prisma;

export default prisma;
