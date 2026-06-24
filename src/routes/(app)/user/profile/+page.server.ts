import prisma from '$lib/server/prisma';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(303, '/login');

	const user = await prisma.user.findUnique({
		where: { id: locals.user.id },
		select: {
			id: true, username: true, email: true, image: true, createdAt: true,
			_count: { select: { modules: true } },
		},
	});

	return { user: JSON.parse(JSON.stringify(user)) };
};

export const actions: Actions = {
	updateProfile: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const form = await request.formData();
		const username = (form.get('username') as string)?.trim();
		const image = (form.get('image') as string)?.trim() || null;

		if (!username || username.length < 3) {
			return fail(400, { error: 'Username must be at least 3 characters.' });
		}

		await prisma.user.update({
			where: { id: locals.user.id },
			data: { username, image },
		});

		return { success: true };
	},

	changePassword: async ({ request, locals }) => {
		if (!locals.user) throw redirect(303, '/login');

		const form = await request.formData();
		const currentPassword = form.get('currentPassword') as string;
		const newPassword = form.get('newPassword') as string;

		if (!currentPassword || !newPassword) {
			return fail(400, { error: 'Both fields are required.' });
		}
		if (newPassword.length < 8) {
			return fail(400, { error: 'New password must be at least 8 characters.' });
		}

		try {
			await auth.api.changePassword({
				body: { currentPassword, newPassword },
				headers: request.headers,
			});
		} catch {
			return fail(400, { error: 'Current password is incorrect.' });
		}

		return { passwordChanged: true };
	},
};
