import { getUserModules } from '$lib/server/db/modules';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');
	const modules = await getUserModules(locals.user.id);
	return { modules };
};

export const actions: Actions = {
	togglePublish: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');
		const form = await request.formData();
		const id = form.get('id') as string;
		const mod = await prisma.module.findUnique({ where: { id } });
		if (!mod || mod.authorId !== locals.user.id) return;
		await prisma.module.update({ where: { id }, data: { published: !mod.published } });
	},
};
