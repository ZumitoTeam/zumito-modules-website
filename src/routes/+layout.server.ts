import type { LayoutServerLoad } from './$types';
import en from '../../messages/en.json';
import es from '../../messages/es.json';

const messages: Record<string, typeof en> = { en, es };

export const load: LayoutServerLoad = async ({ request }) => {
	const acceptLanguage = request.headers.get('accept-language') ?? '';
	const locale = acceptLanguage.includes('es') ? 'es' : 'en';

	return { locale, t: messages[locale] };
};
