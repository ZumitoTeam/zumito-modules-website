import { getModuleStats, getPopularFeatures, getPopularModules } from '$lib/server/db/modules';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [stats, popularFeatures, latestModules] = await Promise.all([
		getModuleStats(),
		getPopularFeatures(12),
		getPopularModules(5),
	]);

	return { stats, popularFeatures, latestModules };
};
