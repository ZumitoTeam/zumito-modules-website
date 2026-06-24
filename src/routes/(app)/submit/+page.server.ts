import prisma from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
import { getFileAdapter } from '$lib/server/file-adapters/factory';
import { randomBytes } from 'node:crypto';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const features = await prisma.moduleFeature.findMany({ orderBy: { name: 'asc' } });
	const modules = await prisma.module.findMany({
		where: { published: true, approved: true },
		select: { id: true, name: true, slug: true },
		orderBy: { name: 'asc' },
	});

	return { user: locals.user, features, modules };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const form = await request.formData();
		const name = form.get('name') as string;
		const slug = form.get('slug') as string;
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
		let iconUrl = '';
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
		} catch (e) {
			return fail(400, { error: 'Failed to upload images. Please try again.' });
		}

		if (!name || !slug || !description || !npm) {
			return fail(400, { error: 'Name, slug, description, and npm package are required.' });
		}

		const existing = await prisma.module.findUnique({ where: { slug } });
		if (existing) return fail(400, { error: 'A module with this slug already exists.' });

		await prisma.module.create({
			data: {
				name,
				slug,
				description,
				shortDescription,
				instructions,
				npm,
				sourceCode: sourceCode || null,
				price,
				authorId: locals.user.id,
				icon: iconUrl,
				images: imageRecords.length > 0 ? { create: imageRecords } : undefined,
				features: {
					connect: await Promise.all(
						featureNames.map(async (n) => {
							let f = await prisma.moduleFeature.findUnique({ where: { name: n } });
							if (!f) f = await prisma.moduleFeature.create({ data: { name: n } });
							return { id: f.id };
						})
					),
				},
				dependencies: dependencyIds.length > 0
					? { create: dependencyIds.map(id => ({ dependencyId: id })) }
					: undefined,
				addonTargets: addonIds.length > 0
					? { create: addonIds.map(id => ({ baseModuleId: id })) }
					: undefined,
				faqs: faqs.length > 0
					? { create: faqs }
					: undefined,
			},
		});

		throw redirect(303, `/module/${slug}`);
	},
};
