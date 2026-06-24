import prisma from '$lib/server/prisma';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const limit = parseInt(url.searchParams.get('limit') ?? '20');

	const modules = await prisma.module.findMany({
		where: {
			published: true,
			approved: true,
			...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
		},
		orderBy: { installs: { _count: 'desc' } },
		take: Math.min(limit, 100),
		select: { id: true, slug: true, name: true, shortDescription: true, npm: true },
	});

	return json(modules);
};
