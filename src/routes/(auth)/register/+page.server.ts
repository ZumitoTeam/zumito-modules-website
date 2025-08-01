import { fail } from '@sveltejs/kit';
import prisma from '$lib/prisma.js';
import { createToken } from '$lib/tokenParser';
import bcrypt from 'bcryptjs';

export const actions = {
	register: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const username = data.get('username') as string;
		const password = data.get('password') as string;
		const password2 = data.get('password2') as string;

		// Validación básica
		if (!email || !username || !password || !password2) {
			return fail(400, {
				error: 'All fields are required',
				email,
				username
			});
		}

		if (!isEmailValid(email)) {
			return fail(400, {
				error: 'Please enter a valid email address',
				email,
				username
			});
		}

		if (username.length < 3) {
			return fail(400, {
				error: 'Username must be at least 3 characters long',
				email,
				username
			});
		}

		if (password.length < 6) {
			return fail(400, {
				error: 'Password must be at least 6 characters long',
				email,
				username
			});
		}

		if (password !== password2) {
			return fail(400, {
				error: 'Both passwords must be equal',
				email,
				username
			});
		}

		if (await userExists(email, username)) {
			return fail(400, {
				error: 'Email or username already in use',
				email,
				username
			});
		}

		try {
			// Hash de la contraseña
			const hashedPassword = await bcrypt.hash(password, 12);

			const user = await prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					username,
				}
			});

			if (!user) {
				return fail(500, {
					error: 'Error creating user',
					email,
					username
				});
			}

			const token = createToken({
				email,
				username: user.username,
				userId: user.id,
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
			console.error('Registration error:', error);
			return fail(500, {
				error: 'An error occurred during registration. Please try again.',
				email,
				username
			});
		}
	},
};

function isEmailValid(email: string) {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email string against the regex
    return emailRegex.test(email);
}

async function userExists(email: string, username: string) {
	const user = await prisma.user.findFirst({
		where: {
			OR: [
				{ email: email },
				{ username: username }
			]
		}
	});
	return user != null
}