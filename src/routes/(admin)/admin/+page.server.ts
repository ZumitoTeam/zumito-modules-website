import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [moduleCount, pendingModules, userCount, installCount] = await Promise.all([
		prisma.module.count(),
		prisma.module.count({ where: { approved: false } }),
		prisma.user.count(),
		prisma.moduleInstall.count(),
	]);

	return { stats: { moduleCount, pendingModules, userCount, installCount } };
};
