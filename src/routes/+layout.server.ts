import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ request }) => {
	const acceptLanguage = request.headers.get('accept-language') ?? '';
	const locale = acceptLanguage.includes('es') ? 'es' : 'en';

	return { locale };
};
