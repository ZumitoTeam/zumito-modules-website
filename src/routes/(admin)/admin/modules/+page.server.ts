import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const filter = url.searchParams.get('filter') ?? 'all';
	const search = url.searchParams.get('search') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1');

	const where: any = filter === 'pending' ? { approved: false } : filter === 'approved' ? { approved: true } : {};
	if (search) {
		where.name = { contains: search, mode: 'insensitive' };
	}

	const [modules, total] = await Promise.all([
		prisma.module.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * 20,
			take: 20,
			select: {
				id: true, slug: true, name: true, icon: true, createdAt: true, published: true, approved: true,
				author: { select: { username: true } },
				_count: { select: { installs: true } },
			},
		}),
		prisma.module.count({ where }),
	]);

	return { modules: JSON.parse(JSON.stringify(modules)), filter, search, page, totalPages: Math.ceil(total / 20), total };
};
