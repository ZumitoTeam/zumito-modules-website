import prisma from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1');

	const where: any = { approved: false };
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
				id: true, slug: true, name: true, icon: true, shortDescription: true, createdAt: true,
				author: { select: { username: true } },
				_count: { select: { installs: true } },
			},
		}),
		prisma.module.count({ where }),
	]);

	return { modules: JSON.parse(JSON.stringify(modules)), search, page, totalPages: Math.ceil(total / 20), total };
};

export const actions: Actions = {
	approve: async ({ request }) => {
		const form = await request.formData();
		await prisma.module.update({ where: { id: form.get('id') as string }, data: { approved: true } });
	},
	reject: async ({ request }) => {
		const form = await request.formData();
		await prisma.module.delete({ where: { id: form.get('id') as string } });
	},
};