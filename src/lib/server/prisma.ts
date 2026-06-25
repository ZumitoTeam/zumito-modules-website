import { dev } from '$app/environment';
import { PrismaClient } from '$lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
	const url = process.env['DATABASE_URL']!;
	return new PrismaClient({ adapter: new PrismaPg(url) });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (dev) globalForPrisma.prisma = prisma;

export default prisma;
