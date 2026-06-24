import prisma from '$lib/server/prisma';
import { redirect, fail, error } from '@sveltejs/kit';
import { getFileAdapter } from '$lib/server/file-adapters/factory';
import { randomBytes } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const mod = await prisma.module.findUnique({
		where: { slug: params.slug },
		select: {
			id: true,
			name: true,
			slug: true,
			description: true,
			shortDescription: true,
			instructions: true,
			npm: true,
			sourceCode: true,
			price: true,
			authorId: true,
			features: { select: { name: true } },
			dependencies: { select: { dependencyId: true } },
			addonTargets: { select: { baseModuleId: true } },
			faqs: { select: { question: true, answer: true } },
			icon: true,
			images: { select: { url: true, altText: true } },
		},
	});

	if (!mod) throw error(404);
	if (mod.authorId !== locals.user.id) throw redirect(303, `/module/${params.slug}`);

	const allFeatures = await prisma.moduleFeature.findMany({ orderBy: { name: 'asc' } });
	const allModules = await prisma.module.findMany({
		where: { published: true, approved: true, id: { not: mod.id } },
		select: { id: true, name: true },
		orderBy: { name: 'asc' },
	});

	return {
		mod: JSON.parse(JSON.stringify(mod)),
		features: allFeatures,
		modules: allModules,
	};
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const form = await request.formData();
		const name = form.get('name') as string;
		const description = form.get('description') as string;
		const shortDescription = form.get('shortDescription') as string;
		const instructions = form.get('instructions') as string;
		const npm = form.get('npm') as string;
		const sourceCode = form.get('sourceCode') as string;
		const price = parseFloat(form.get('price') as string) || 0;
		const featureNames = (form.getAll('features') as string[])
			.flatMap(f => f.split(',').map(s => s.trim()))
			.filter(Boolean);
		const dependencyIds = form.getAll('dependencies') as string[];
		const addonIds = form.getAll('addons') as string[];
		const faqQuestions = form.getAll('faq_question') as string[];
		const faqAnswers = form.getAll('faq_answer') as string[];
		const faqs = faqQuestions
			.map((q, i) => ({ question: q.trim(), answer: (faqAnswers[i] || '').trim() }))
			.filter(f => f.question && f.answer);

		// File uploads
		const adapter = getFileAdapter();
		const iconFile = form.get('icon') as File | null;
		const screenshotFiles = form.getAll('screenshots').filter((f): f is File => f instanceof File);
		let iconUrl: string | undefined;
		const imageRecords: { url: string; altText: string }[] = [];

		try {
			if (iconFile && iconFile.size > 0) {
				const ext = iconFile.name.split('.').pop() || 'png';
				const key = `icons/${randomBytes(8).toString('hex')}.${ext}`;
				const buf = Buffer.from(await iconFile.arrayBuffer());
				iconUrl = await adapter.upload(key, buf, iconFile.type);
			}
			for (const file of screenshotFiles) {
				if (file.size === 0) continue;
				const ext = file.name.split('.').pop() || 'png';
				const key = `screenshots/${randomBytes(8).toString('hex')}.${ext}`;
				const buf = Buffer.from(await file.arrayBuffer());
				const url = await adapter.upload(key, buf, file.type);
				imageRecords.push({ url, altText: '' });
			}
		} catch {
			return fail(400, { error: 'Failed to upload images.' });
		}

		// Handle existing images reorder/delete
		const existingOrder = form.getAll('existing_order') as string[];
		const existing = await prisma.module.findUnique({
			where: { slug: params.slug },
			select: { id: true, images: true, authorId: true },
		});
		if (!existing || existing.authorId !== locals.user.id) {
			throw redirect(303, `/module/${params.slug}`);
		}
		const originalUrls = existing.images.map(i => i.url) ?? [];
		const deletedUrls = originalUrls.filter(url => !existingOrder.includes(url));

		// Delete removed images from storage
		for (const url of deletedUrls) {
			const key = url.replace('/uploads/', '');
			adapter.delete(key).catch(() => {});
		}

		// Prepare final image order: existing (reordered) + new uploads
		const finalImages = [
			...existingOrder.map((url, i) => ({ url, altText: existing.images.find(im => im.url === url)?.altText ?? '' })),
			...imageRecords,
		];

		if (!name || !description || !npm) {
			return fail(400, { error: 'Name, description, and npm package are required.' });
		}

		await prisma.module.update({
			where: { slug: params.slug },
			data: {
				name,
				description,
				shortDescription,
				instructions,
				npm,
				sourceCode: sourceCode || null,
				price,
				...(iconUrl !== undefined ? { icon: iconUrl } : {}),
				images: { deleteMany: {}, create: finalImages },
				features: {
					set: [],
					connect: await Promise.all(
						featureNames.map(async (n) => {
							let f = await prisma.moduleFeature.findUnique({ where: { name: n } });
							if (!f) f = await prisma.moduleFeature.create({ data: { name: n } });
							return { id: f.id };
						})
					),
				},
				dependencies: { deleteMany: {}, create: dependencyIds.map(id => ({ dependencyId: id })) },
				addonTargets: { deleteMany: {}, create: addonIds.map(id => ({ baseModuleId: id })) },
				...(faqs.length > 0 ? { faqs: { deleteMany: {}, create: faqs } } : {}),
			},
		});

		throw redirect(303, `/module/${params.slug}`);
	},
};
