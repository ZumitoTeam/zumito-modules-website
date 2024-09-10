import { error, type RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ params }) {
	const module = await prisma.module.findFirst({
        where: {
            name: {
                equals: params.name
            }
        },
        include: {
            comments: {
                include: {
                  author: true,  // Include the author of each comment
                },
            },
            faqs: true,
            _count: {
                select: {
                  installs: true, // Get the install count
                },
            },
        }
    })

    if (!module) return error(404, 'Module not found');

    return {
        module: JSON.parse(JSON.stringify(module))
    };
}