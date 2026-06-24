import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const modules = await prisma.module.findMany({
		where: { authorId: locals.user.id },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true,
			slug: true,
			name: true,
			shortDescription: true,
			icon: true,
			published: true,
			approved: true,
			createdAt: true,
			_count: { select: { installs: true } },
		},
	});

	return { modules };
};
