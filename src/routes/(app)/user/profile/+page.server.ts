import prisma from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const user = await prisma.user.findUnique({
		where: { id: locals.user.id },
		select: { id: true, username: true, email: true, image: true, createdAt: true },
	});

	return { user: JSON.parse(JSON.stringify(user)) };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const form = await request.formData();
		const username = form.get('username') as string;

		if (!username) return fail(400, { error: 'Username is required.' });

		await prisma.user.update({
			where: { id: locals.user.id },
			data: { username },
		});

		return { success: true };
	},
};
