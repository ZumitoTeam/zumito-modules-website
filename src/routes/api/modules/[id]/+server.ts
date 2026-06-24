import prisma from '$lib/server/prisma';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const mod = await prisma.module.findUnique({
		where: { slug: params.id },
		select: { id: true, slug: true, name: true, description: true, shortDescription: true, instructions: true, npm: true, icon: true, createdAt: true, author: { select: { username: true } }, features: { select: { name: true, emoji: true } }, _count: { select: { installs: true } } },
	});
	if (!mod) throw error(404);
	return json(mod);
};
