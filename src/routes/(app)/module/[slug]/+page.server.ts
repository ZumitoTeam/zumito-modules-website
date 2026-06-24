import prisma from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const mod = await prisma.module.findUnique({
		where: { slug: params.slug },
		select: {
			id: true,
			slug: true,
			name: true,
			description: true,
			shortDescription: true,
			instructions: true,
			price: true,
			npm: true,
			sourceCode: true,
			published: true,
			approved: true,
			icon: true,
			createdAt: true,
			author: { select: { id: true, username: true, image: true } },
			images: { select: { url: true, altText: true } },
			features: { select: { name: true, emoji: true } },
			faqs: { select: { question: true, answer: true } },
			comments: {
				select: {
					id: true,
					content: true,
					createdAt: true,
					author: { select: { username: true, image: true } },
				},
				orderBy: { createdAt: 'desc' },
				take: 20,
			},
			dependencies: {
				select: {
					dependency: { select: { slug: true, name: true, icon: true } },
				},
			},
			addons: {
				select: {
					baseModule: { select: { slug: true, name: true, icon: true } },
				},
			},
			requiredBy: {
				select: {
					module: { select: { slug: true, name: true, icon: true } },
				},
			},
			_count: { select: { installs: true, comments: true } },
		},
	});

	if (!mod) throw error(404, 'Module not found');

	const userInstall = locals.user
		? await prisma.moduleInstall.findUnique({
				where: { userId_moduleId: { userId: locals.user.id, moduleId: mod.id } },
			})
		: null;

	return { mod: JSON.parse(JSON.stringify(mod)), userHasInstalled: !!userInstall };
};

export const actions: Actions = {
	install: async ({ request, locals }) => {
		if (!locals.user) return;

		const form = await request.formData();
		const moduleId = form.get('moduleId') as string;

		await prisma.moduleInstall.upsert({
			where: { userId_moduleId: { userId: locals.user.id, moduleId } },
			create: { userId: locals.user.id, moduleId },
			update: {},
		});
	},

	comment: async ({ request, locals }) => {
		if (!locals.user) return;

		const form = await request.formData();
		const moduleId = form.get('moduleId') as string;
		const content = form.get('content') as string;

		if (!content?.trim()) return;

		await prisma.comment.create({
			data: {
				content,
				authorId: locals.user.id,
				moduleId,
			},
		});
	},
};
