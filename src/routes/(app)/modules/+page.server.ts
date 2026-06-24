import { getPublishedModules } from '$lib/server/db/modules';
import { getFeatures } from '$lib/server/db/features';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const search = url.searchParams.get('search') ?? '';
	const feature = url.searchParams.get('feature') ?? '';
	const sort = (url.searchParams.get('sort') as 'installs' | 'recent') ?? 'installs';
	const page = parseInt(url.searchParams.get('page') ?? '1');

	const [result, allFeatures] = await Promise.all([
		getPublishedModules({ search, feature, sort, page }),
		getFeatures(),
	]);

	return { ...result, allFeatures, search, selectedFeature: feature, sort };
};
