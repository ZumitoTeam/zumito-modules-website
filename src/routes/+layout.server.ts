import type { LayoutServerLoad } from './$types';
import en from '../locales/en.json';
import es from '../locales/es.json';

const messages: Record<string, typeof en> = { en, es };

export const load: LayoutServerLoad = async (event) => {
	const locale = event.locals.locale ?? 'en';
	return { locale, t: messages[locale] };
};
