import prisma from '$lib/server/prisma';
import { getFileAdapter } from '$lib/server/file-adapters/factory';
import { json, error } from '@sveltejs/kit';
import { randomBytes } from 'node:crypto';
import type { RequestHandler } from './$types';

async function requireOwnership(slug: string, userId: string) {
	const mod = await prisma.module.findUnique({ where: { slug }, select: { id: true, authorId: true } });
	if (!mod || mod.authorId !== userId) throw error(403, 'Not authorized');
	return mod;
}

export const POST: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) throw error(401);

	const mod = await requireOwnership(params.slug, locals.user.id);
	const form = await request.formData();
	const action = form.get('action') as string;
	const adapter = getFileAdapter();

	try {
		switch (action) {
			case 'upload': {
				const file = form.get('file') as File;
				if (!file || !(file instanceof File)) throw error(400, 'No file provided');
				if (!file.type.startsWith('image/')) throw error(400, 'Only images allowed');
				if (file.size > 5_000_000) throw error(400, 'Max 5MB');

				const type = form.get('type') as string || 'screenshot';
				const ext = file.name.split('.').pop() || 'png';
				const key = type === 'icon' ? `modules/${mod.slug}/icon.${ext}` : `modules/${mod.slug}/screenshots/${randomBytes(8).toString('hex')}.${ext}`;
				const buf = Buffer.from(await file.arrayBuffer());
				const url = await adapter.upload(key, buf, file.type);

				if (type === 'icon') {
					await prisma.module.update({ where: { id: mod.id }, data: { icon: url } });
				} else {
					await prisma.moduleImage.create({
						data: { url, altText: '', moduleId: mod.id },
					});
				}

				return json({ ok: true, url });
			}

			case 'delete': {
				const url = form.get('url') as string;
				if (!url) throw error(400, 'No URL provided');

				await prisma.moduleImage.deleteMany({ where: { url, moduleId: mod.id } });
				const key = url.replace('/uploads/', '');
				adapter.delete(key).catch(() => {});

				return json({ ok: true });
			}

			case 'reorder': {
				const urls = form.getAll('urls') as string[];
				const existing = await prisma.moduleImage.findMany({ where: { moduleId: mod.id } });

				// Delete all, recreate in order
				await prisma.moduleImage.deleteMany({ where: { moduleId: mod.id } });
				if (urls.length > 0) {
					const ordered = urls.map((url, i) => {
						const found = existing.find(im => im.url === url);
						return { url, altText: found?.altText ?? '', moduleId: mod.id };
					});
					await prisma.moduleImage.createMany({ data: ordered });
				}

				return json({ ok: true, count: urls.length });
			}

			default:
				throw error(400, 'Invalid action');
		}
	} catch (e) {
		if (e instanceof Error && 'status' in e) throw e;
		console.error('Image API error:', e);
		return json({ ok: false, error: 'Failed to process image.' }, { status: 500 });
	}
};
