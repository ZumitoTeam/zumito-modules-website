import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ }) {
	const modules = await prisma.module.findMany({
        "orderBy": {
            installs: {
                _count: 'desc'
            }
        },
        "take": 10,
        include: {
            _count: {
                select: {
                  installs: true, // Get the install count
                },
            },
        }
    })
    return {
        modules: JSON.parse(JSON.stringify(modules))
    };
}