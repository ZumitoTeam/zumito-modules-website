import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const form = await request.formData();
	const locale = form.get('locale') as string;
	const redirectTo = (form.get('redirect') as string) || '/';

	if (['en', 'es'].includes(locale)) {
		cookies.set('app-locale', locale, { path: '/', maxAge: 60 * 60 * 24 * 365 });
	}

	redirect(303, redirectTo);
};
