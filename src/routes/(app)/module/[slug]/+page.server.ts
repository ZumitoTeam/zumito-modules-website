import { getModuleBySlug } from '$lib/server/db/modules';
import { createComment, getUserInstall, upsertInstall } from '$lib/server/db/comments';
import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const mod = await getModuleBySlug(params.slug);
	if (!mod) throw error(404, 'Module not found');

	const userInstall = locals.user ? await getUserInstall(locals.user.id, mod.id) : null;

	return { mod: JSON.parse(JSON.stringify(mod)), userHasInstalled: !!userInstall };
};

export const actions: Actions = {
	install: async ({ request, locals }) => {
		if (!locals.user) return;
		const form = await request.formData();
		await upsertInstall(locals.user.id, form.get('moduleId') as string);
	},
	comment: async ({ request, locals }) => {
		if (!locals.user) return;
		const form = await request.formData();
		const content = form.get('content') as string;
		if (!content?.trim()) return;
		await createComment(locals.user.id, form.get('moduleId') as string, content);
	},
};
