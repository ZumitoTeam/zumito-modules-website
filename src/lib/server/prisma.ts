import { dev } from '$app/environment';
import { PrismaClient } from '$lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from '$env/dynamic/private';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
	return new PrismaClient({ adapter: new PrismaPg(env.DATABASE_URL) });
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (dev) globalForPrisma.prisma = prisma;

export default prisma;
