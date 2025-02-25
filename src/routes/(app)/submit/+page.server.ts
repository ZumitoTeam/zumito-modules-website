import type { Actions } from './$types';
import Prisma from '$lib/prisma'; 
import { redirect } from '@sveltejs/kit';
import { decodeToken, isTokenValid } from '$lib/tokenParser';

export const actions = {
	createModule: async (event) => {
		const token =  event.cookies.get('token');
		if (!token || !isTokenValid(token)) return redirect(302, '/login');
		const userId = decodeToken(token)!.userId;
		
		const inputs = await event.request.formData();
		const name = inputs.get('name') as string;
		const description = inputs.get('description') as string;
		const npm = inputs.get('npm') as string;
		
		
		if (name === '') 			return { status: 400, error: 'Name is required' };
		if (name.includes(' ')) 	return { status: 400, error: 'Name cannot contain spaces' };
		if (description === '') 	return { status: 400, error: 'Description is required' };

		try {
			const alredyExists = await Prisma.module.findFirst({
				where: {
					name: name,
				},
			});
			if (alredyExists) return { status: 400, error: 'Module with this name already exists' };
		} catch (e) {
			console.error(e)
			return { status: 500, error: 'Internal server error' };
		}

		const module = await Prisma.module.create({
			data: {
				name: name,
				description: description || '',
				npm: npm || '',
				instructions: '',
				authorId: userId,
				published: false,
			},
		});

		return redirect(303, `/module/${module.name}`);
	},
} satisfies Actions;