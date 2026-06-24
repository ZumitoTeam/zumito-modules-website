import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const feature = url.searchParams.get('feature') ?? '';
	const sort = url.searchParams.get('sort') ?? 'installs';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const limit = 12;

	const allFeatures = await prisma.moduleFeature.findMany({ orderBy: { name: 'asc' } });

	const where = {
		published: true,
		approved: true,
		...(search ? {
			OR: [
				{ name: { contains: search, mode: 'insensitive' as const } },
				{ shortDescription: { contains: search, mode: 'insensitive' as const } },
			],
		} : {}),
		...(feature ? {
			features: { some: { name: feature } },
		} : {}),
	};

	const orderBy = sort === 'recent'
		? { createdAt: 'desc' as const }
		: { installs: { _count: 'desc' as const } };

	const [modules, total] = await Promise.all([
		prisma.module.findMany({
			where,
			orderBy,
			skip: (page - 1) * limit,
			take: limit,
			select: {
				id: true,
				slug: true,
				name: true,
				shortDescription: true,
				icon: true,
				npm: true,
				createdAt: true,
				author: { select: { username: true } },
				features: { select: { name: true, emoji: true } },
				_count: { select: { installs: true } },
			},
		}),
		prisma.module.count({ where }),
	]);

	return {
		modules,
		allFeatures,
		search,
		selectedFeature: feature,
		sort,
		page,
		totalPages: Math.ceil(total / limit),
		total,
	};
};
