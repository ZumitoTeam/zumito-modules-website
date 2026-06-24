import prisma from '$lib/server/prisma';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const features = await prisma.moduleFeature.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { modules: true } } } });
	return { features };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const form = await request.formData();
		const name = form.get('name') as string;
		const emoji = form.get('emoji') as string || '🔧';
		if (name) await prisma.moduleFeature.create({ data: { name, emoji } });
	},
	delete: async ({ request }) => {
		const form = await request.formData();
		await prisma.moduleFeature.delete({ where: { id: form.get('id') as string } });
	},
};
