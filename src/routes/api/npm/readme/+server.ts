import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { package: pkg } = await request.json();
	if (!pkg || typeof pkg !== 'string') {
		return json({ ok: false, error: 'Package name is required.' }, { status: 400 });
	}

	try {
		const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg)}`);
		if (!res.ok) {
			return json({ ok: false, error: res.status === 404 ? 'Package not found on npm.' : `npm registry error (${res.status}).` });
		}

		const data = await res.json();
		const readme = data.readme;

		if (!readme || typeof readme !== 'string' || readme.trim().length === 0) {
			return json({ ok: false, error: 'No README found for this package.' });
		}

		return json({ ok: true, readme });
	} catch {
		return json({ ok: false, error: 'Failed to fetch package info. Check the package name.' }, { status: 502 });
	}
};
