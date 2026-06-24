import prisma from '../prisma';

export async function getUserById(id: string) {
	return prisma.user.findUnique({
		where: { id },
		select: { id: true, username: true, email: true, image: true, role: true, createdAt: true, banned: true, _count: { select: { modules: true } } },
	});
}

export async function getAdminUsers(search = '', page = 1) {
	const limit = 20;
	const where = search
		? { OR: [{ username: { contains: search, mode: 'insensitive' as const } }, { email: { contains: search, mode: 'insensitive' as const } }] }
		: {};

	const [users, total] = await Promise.all([
		prisma.user.findMany({
			where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' },
			select: { id: true, username: true, email: true, role: true, banned: true, createdAt: true },
		}),
		prisma.user.count({ where }),
	]);

	return { users, total, page, totalPages: Math.ceil(total / limit) };
}

export async function updateUser(id: string, data: Record<string, unknown>) {
	return prisma.user.update({ where: { id }, data });
}
