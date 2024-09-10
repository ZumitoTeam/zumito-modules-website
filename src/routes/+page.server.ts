import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ }) {
	const modules = await prisma.module.findMany({
        "orderBy": [ {"installs" : "desc"} ],
        "take": 10
    })
    return {
        modules: JSON.parse(JSON.stringify(modules))
    };
}