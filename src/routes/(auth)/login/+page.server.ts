import { createToken } from '$lib/tokenParser';
import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

        const token = createToken({ 
            email: email as string,
			userId: 1,
			username: 'test'
        });

		cookies.set('token', token, { path: '/' });

		return redirect(303, '/');
	},
};