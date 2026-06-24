import { getModuleStats, getPopularModules } from '$lib/server/db/modules';
import { getPopularFeatures } from '$lib/server/db/features';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [stats, popularFeatures, latestModules] = await Promise.all([
		getModuleStats(),
		getPopularFeatures(12),
		getPopularModules(5),
	]);

	return { stats, popularFeatures, latestModules };
};
