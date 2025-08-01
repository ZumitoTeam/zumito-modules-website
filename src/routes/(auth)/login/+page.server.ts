import { createToken } from '$lib/tokenParser';
import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		// Validación básica
		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required',
				email
			});
		}

		if (!email.includes('@')) {
			return fail(400, {
				error: 'Please enter a valid email address',
				email
			});
		}

		try {
			// Buscar usuario por email
			const user = await prisma.user.findUnique({
				where: { email }
			});

			if (!user) {
				return fail(400, {
					error: 'Invalid email or password',
					email
				});
			}

			// Verificar contraseña
			const validPassword = await bcrypt.compare(password, user.password);

			if (!validPassword) {
				return fail(400, {
					error: 'Invalid email or password',
					email
				});
			}

			// Crear token con información real del usuario
			const token = createToken({ 
				email: user.email,
				userId: user.id,
				username: user.username
			});

			// Establecer cookie con configuración de seguridad
			cookies.set('token', token, { 
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 días
			});

			return {
				success: true,
				redirectTo: '/'
			};

		} catch (error) {
			console.error('Login error:', error);
			return fail(500, {
				error: 'An error occurred during login. Please try again.',
				email
			});
		}
	},
};