import prisma from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const page = parseInt(url.searchParams.get('page') ?? '1');
	const limit = 20;

	const where = search
		? { OR: [{ username: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }
		: {};

	const [users, total] = await Promise.all([
		prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, username: true, email: true, role: true, banned: true, createdAt: true } }),
		prisma.user.count({ where }),
	]);

	return { users, search, page, totalPages: Math.ceil(total / limit) };
};

export const actions: Actions = {
	toggleBan: async ({ request }) => {
		const form = await request.formData();
		const userId = form.get('userId') as string;
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) return;
		await prisma.user.update({ where: { id: userId }, data: { banned: !user.banned } });
	},
	toggleAdmin: async ({ request }) => {
		const form = await request.formData();
		const userId = form.get('userId') as string;
		const user = await prisma.user.findUnique({ where: { id: userId } });
		if (!user) return;
		const newRole = (user.role ?? '').includes('admin') ? 'user' : 'admin';
		await prisma.user.update({ where: { id: userId }, data: { role: newRole } });
	},
};
