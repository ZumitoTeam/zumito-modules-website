import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { decodeToken, isTokenValid } from '$lib/tokenParser';

export async function load({ params, cookies }) {
    const token =  cookies.get('token');
    if (!token || !isTokenValid(token)) return redirect(302, '/login');
    const userId = decodeToken(token)!.userId;

	const module = await prisma.module.findFirst({
        where: {
            name: {
                equals: params.name
            }
        },
        include: {
            faqs: true,
            images: true,
        }
    })

    if (!module) return error(404, 'Module not found');
    if (module.authorId !== userId) return error(403, 'You are not the author of this module');

    return {
        module: JSON.parse(JSON.stringify(module))
    };
}