import { getFileAdapter } from '$lib/server/file-adapters/factory';
import { json } from '@sveltejs/kit';
import { randomBytes } from 'node:crypto';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) return json({ ok: false, error: 'Not authenticated' }, { status: 401 });

	const form = await request.formData();
	const file = form.get('file') as File;
	if (!file || !(file instanceof File)) return json({ ok: false, error: 'No file' }, { status: 400 });
	if (!file.type.startsWith('image/')) return json({ ok: false, error: 'Only images allowed' }, { status: 400 });
	if (file.size > 5_000_000) return json({ ok: false, error: 'Max 5MB' }, { status: 400 });

	try {
		const adapter = getFileAdapter();
		const ext = file.name.split('.').pop() || 'png';
		const type = form.get('type') as string;
		const key = type === 'icon' ? `uploads/icons/${randomBytes(8).toString('hex')}.${ext}` : `uploads/${randomBytes(8).toString('hex')}.${ext}`;
		const buf = Buffer.from(await file.arrayBuffer());
		const url = await adapter.upload(key, buf, file.type);
		return json({ ok: true, url });
	} catch {
		return json({ ok: false, error: 'Upload failed' }, { status: 500 });
	}
};
