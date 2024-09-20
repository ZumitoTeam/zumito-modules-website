import { redirect, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { decodeToken, isTokenValid } from '$lib/tokenParser.js';

export async function load({ cookies }) {
    const token =  cookies.get('token');
    if (!token || !isTokenValid(token)) return redirect(302, '/login');
    const userId = decodeToken(token)!.userId;

	const modules = await prisma.module.findMany({
        "orderBy": {
            id: 'desc'
        },
        where: {
            authorId: userId
        }
    });

    return {
        modules: JSON.parse(JSON.stringify(modules))
    };
}