import { error, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { decodeToken, isTokenValid } from '$lib/tokenParser';
import type { Actions } from './$types';

export async function load({ params, cookies }) {
    const token = cookies.get('token');
    if (!token || !isTokenValid(token)) {
        throw redirect(302, '/login');
    }
    const userId = decodeToken(token)!.userId;

    const module = await prisma.module.findFirst({
        where: {
            name: {
                equals: params.name
            }
        },
        include: {
            _count: {
                select: {
                  installs: true,
                },
            },
        }
    });

    if (!module) {
        throw error(404, 'Module not found');
    }

    if (module.authorId !== userId) {
        throw redirect(302, `/module/${module.name}`);
    }

    return {
        module: JSON.parse(JSON.stringify(module))
    };
}

export const actions = {
    editModule: async ({ request, cookies, params }) => {
        const token = cookies.get('token');
        if (!token || !isTokenValid(token)) {
            throw redirect(302, '/login');
        }
        const userId = decodeToken(token)!.userId;

        const inputs = await request.formData();
        const name = inputs.get('name') as string;
        const shortDescription = inputs.get('shortDescription') as string;
        const description = inputs.get('description') as string;
        const npm = inputs.get('npm') as string;

        if (name === '') return { status: 400, error: 'Name is required' };
        if (name.includes(' ')) return { status: 400, error: 'Name cannot contain spaces' };
        if (shortDescription === '') return { status: 400, error: 'Short description is required' };
        if (description === '') return { status: 400, error: 'Description is required' };

        const existingModule = await prisma.module.findFirst({
            where: {
                name: {
                    equals: params.name
                }
            }
        });

        if (!existingModule) {
            return { status: 404, error: 'Module not found' };
        }

        if (existingModule.authorId !== userId) {
            return { status: 403, error: 'You are not authorized to edit this module' };
        }

        try {
            const updatedModule = await prisma.module.update({
                where: {
                    id: existingModule.id
                },
                data: {
                    name: name,
                    shortDescription: shortDescription,
                    description: description,
                    npm: npm,
                },
            });
            return { status: 200, module: JSON.parse(JSON.stringify(updatedModule)) };
        } catch (e) {
            console.error(e);
            return { status: 500, error: 'Internal server error' };
        }
    },
}