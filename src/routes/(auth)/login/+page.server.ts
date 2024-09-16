import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

        var token = jwt.sign({ 
            email: email
         }, 'secret-key');

		cookies.set('token', token, { path: '/' });

		return redirect(303, '/');
	},
};