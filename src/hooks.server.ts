import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

// --- Auth (must be first to intercept /api/auth/*) ---
const authHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.user = session?.user ?? null;
	event.locals.session = session?.session ?? null;
	return svelteKitHandler({ event, resolve, auth, building: false });
};

// --- Locale from cookie ---
const localeHandle: Handle = async ({ event, resolve }) => {
	const cookieLocale = event.cookies.get('app-locale');
	const acceptLanguage = event.request.headers.get('accept-language') ?? '';
	const locale = cookieLocale || (acceptLanguage.includes('es') ? 'es' : 'en');
	event.locals.locale = locale;
	return resolve(event);
};

export const handle = sequence(authHandle, localeHandle);
