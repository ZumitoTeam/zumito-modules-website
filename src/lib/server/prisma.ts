import { dev } from '$app/environment';
import { PrismaClient } from '$lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '$env/static/private';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; pool: pg.Pool };

const pool = globalForPrisma.pool || new pg.Pool({
	connectionString: DATABASE_URL,
	max: 5,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 10000,
});

if (dev) globalForPrisma.pool = pool;

const adapter = new PrismaPg(pool);

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (dev) globalForPrisma.prisma = prisma;

export default prisma;
