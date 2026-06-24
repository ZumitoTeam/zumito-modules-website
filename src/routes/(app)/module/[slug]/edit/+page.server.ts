import prisma from '$lib/server/prisma';
import { redirect, fail, error } from '@sveltejs/kit';
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
			},
		});

		throw redirect(303, `/module/${params.slug}`);
	},
};
