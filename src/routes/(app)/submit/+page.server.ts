import prisma from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
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
		const featureNames = (form.getAll('features') as string[]).flatMap(f => f.split(',').map(s => s.trim())).filter(Boolean);
		const dependencyIds = form.getAll('dependencies') as string[];
		const faqQuestions = form.getAll('faq_question') as string[];
		const faqAnswers = form.getAll('faq_answer') as string[];
		const faqs = faqQuestions.map((q, i) => ({ question: q.trim(), answer: (faqAnswers[i] || '').trim() })).filter(f => f.question && f.answer);

		// Images uploaded via API; form receives URL strings
		const iconUrl = (form.get('icon') as string)?.trim() || null;
		const screenshots = (form.getAll('screenshots') as string[]).filter(Boolean);

		if (!name || !slug || !description || !npm) {
			return fail(400, { error: 'Name, slug, description, and npm package are required.' });
		}

		const existing = await prisma.module.findUnique({ where: { slug } });
		if (existing) return fail(400, { error: 'A module with this slug already exists.' });

		await prisma.module.create({
			data: {
				name, slug, description, shortDescription, instructions, npm,
				sourceCode: sourceCode || null, price, authorId: locals.user.id,
				icon: iconUrl || '',
				images: screenshots.length > 0 ? { create: screenshots.map(url => ({ url, altText: '' })) } : undefined,
				features: { connect: await Promise.all(featureNames.map(async (n) => { let f = await prisma.moduleFeature.findUnique({ where: { name: n } }); if (!f) f = await prisma.moduleFeature.create({ data: { name: n } }); return { id: f.id }; })) },
				dependencies: dependencyIds.length > 0 ? { create: dependencyIds.map(id => ({ dependencyId: id })) } : undefined,
				faqs: faqs.length > 0 ? { create: faqs } : undefined,
			},
		});

		throw redirect(303, `/module/${slug}`);
	},
};
