import prisma from '../prisma';
import type { Prisma } from '../../generated/prisma/client';

export async function getFeatures() {
	return prisma.moduleFeature.findMany({
		orderBy: { name: 'asc' },
		include: { _count: { select: { modules: true } } },
	});
}

export async function getPopularFeatures(limit = 12) {
	return prisma.moduleFeature.findMany({
		select: { id: true, name: true, emoji: true, _count: { select: { modules: true } } },
		orderBy: { modules: { _count: 'desc' } },
		take: limit,
	});
}

export async function createFeature(name: string, emoji = '🔧') {
	return prisma.moduleFeature.create({ data: { name, emoji } });
}

export async function deleteFeature(id: string) {
	return prisma.moduleFeature.delete({ where: { id } });
}
