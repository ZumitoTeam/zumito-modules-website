import prisma from '../prisma';

export async function getPublishedModules(options?: {
	search?: string;
	feature?: string;
	sort?: 'installs' | 'recent';
	page?: number;
	limit?: number;
}) {
	const { search, feature, sort = 'installs', page = 1, limit = 12 } = options ?? {};

	const where = {
		published: true,
		approved: true,
		...(search ? {
			OR: [
				{ name: { contains: search, mode: 'insensitive' as const } },
				{ shortDescription: { contains: search, mode: 'insensitive' as const } },
			],
		} : {}),
		...(feature ? { features: { some: { name: feature } } } : {}),
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
				id: true, slug: true, name: true, shortDescription: true, icon: true,
				npm: true, createdAt: true,
				author: { select: { username: true } },
				features: { select: { name: true, emoji: true } },
				_count: { select: { installs: true } },
			},
		}),
		prisma.module.count({ where }),
	]);

	return { modules, total, page, totalPages: Math.ceil(total / limit) };
}

export async function getModuleBySlug(slug: string) {
	return prisma.module.findUnique({
		where: { slug },
		select: {
			id: true, slug: true, name: true, description: true,
			shortDescription: true, instructions: true, price: true,
			npm: true, sourceCode: true, published: true, approved: true,
			icon: true, createdAt: true,
			author: { select: { id: true, username: true, image: true } },
			images: { select: { url: true, altText: true } },
			features: { select: { name: true, emoji: true } },
			faqs: { select: { question: true, answer: true } },
			comments: {
				select: { id: true, content: true, createdAt: true, author: { select: { username: true, image: true } } },
				orderBy: { createdAt: 'desc' },
				take: 20,
			},
			dependencies: { select: { dependency: { select: { slug: true, name: true, icon: true } } } },
			addons: { select: { addonModule: { select: { slug: true, name: true, icon: true } } } },
			addonTargets: { select: { baseModule: { select: { slug: true, name: true, icon: true } } } },
			requiredBy: { select: { module: { select: { slug: true, name: true, icon: true } } } },
			_count: { select: { installs: true, comments: true } },
		},
	});
}

export async function getPopularModules(limit = 5) {
	return prisma.module.findMany({
		where: { published: true, approved: true },
		orderBy: { installs: { _count: 'desc' } },
		take: limit,
		select: {
			id: true, slug: true, name: true, shortDescription: true, icon: true, npm: true,
			author: { select: { username: true } },
			features: { select: { name: true, emoji: true } },
			_count: { select: { installs: true } },
		},
	});
}

export async function getModuleStats() {
	const [moduleCount, installCount, developerCount, featureCount] = await Promise.all([
		prisma.module.count({ where: { published: true, approved: true } }),
		prisma.moduleInstall.count(),
		prisma.module.findMany({
			where: { published: true, approved: true },
			select: { authorId: true },
			distinct: ['authorId'],
		}),
		prisma.moduleFeature.count(),
	]);

	return { modules: moduleCount, installs: installCount, developers: developerCount.length, features: featureCount };
}

export async function getUserModules(authorId: string) {
	return prisma.module.findMany({
		where: { authorId },
		orderBy: { createdAt: 'desc' },
		select: {
			id: true, slug: true, name: true, shortDescription: true, icon: true,
			published: true, approved: true, createdAt: true,
			_count: { select: { installs: true } },
		},
	});
}

export async function getModulesForSelect() {
	return prisma.module.findMany({
		where: { published: true, approved: true },
		select: { id: true, name: true, slug: true },
		orderBy: { name: 'asc' },
	});
}

export async function getAdminModules(filter: 'all' | 'pending' | 'approved', page = 1) {
	const where = filter === 'pending' ? { approved: false } : filter === 'approved' ? { approved: true } : {};
	const limit = 20;

	const [modules, total] = await Promise.all([
		prisma.module.findMany({
			where,
			orderBy: { createdAt: 'desc' },
			skip: (page - 1) * limit,
			take: limit,
			select: {
				id: true, slug: true, name: true, createdAt: true, published: true, approved: true,
				author: { select: { username: true } },
				_count: { select: { installs: true } },
			},
		}),
		prisma.module.count({ where }),
	]);

	return { modules, total, page, totalPages: Math.ceil(total / limit) };
}
