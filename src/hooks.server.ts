import { dev } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

// --- Wuchale locale handling ---
import * as main from '../locales/main.loader.server.svelte.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
import { locales } from '../locales/data.js';

loadLocales(main.key, main.loadIDs, main.loadCatalog, locales);

const localeHandle: Handle = async ({ event, resolve }) => {
	const urlLocale = event.url.searchParams.get('lang');
	if (urlLocale && locales.includes(urlLocale)) {
		event.cookies.set('app-locale', urlLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	const cookieLocale = event.cookies.get('app-locale');
	const acceptLanguage = event.request.headers.get('accept-language') ?? '';
	const locale = cookieLocale || (acceptLanguage.includes('es') ? 'es' : 'en');

	event.locals.locale = locale;
	return await runWithLocale(locale, () => resolve(event));
};

// --- Auth ---
const authHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;
	return svelteKitHandler({ event, resolve, auth, building: !dev });
};

export const handle = sequence(localeHandle, authHandle);
