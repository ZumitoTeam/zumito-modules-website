import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [moduleCount, installCount, developerCount, featureCount, popularFeatures, latestModules] = await Promise.all([
		prisma.module.count({ where: { published: true, approved: true } }),
		prisma.moduleInstall.count(),
		prisma.module.findMany({
			where: { published: true, approved: true },
			select: { authorId: true },
			distinct: ['authorId'],
		}),
		prisma.moduleFeature.count(),
		prisma.moduleFeature.findMany({
			select: { id: true, name: true, emoji: true, _count: { select: { modules: true } } },
			orderBy: { modules: { _count: 'desc' } },
			take: 12,
		}),
		prisma.module.findMany({
			where: { published: true, approved: true },
			orderBy: { installs: { _count: 'desc' } },
			take: 5,
			select: {
				id: true,
				slug: true,
				name: true,
				shortDescription: true,
				icon: true,
				npm: true,
				author: { select: { username: true } },
				features: { select: { name: true, emoji: true } },
				_count: { select: { installs: true } },
			},
		}),
	]);

	return {
		stats: { modules: moduleCount, installs: installCount, developers: developerCount.length, features: featureCount },
		popularFeatures,
		latestModules,
	};
};
