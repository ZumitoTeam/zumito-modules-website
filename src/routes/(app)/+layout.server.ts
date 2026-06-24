import type { LayoutServerLoad } from './$types';
import prisma from '$lib/server/prisma';

export const load: LayoutServerLoad = async (event) => {
	let user: any = null;
	if (event.locals.user) {
		user = await prisma.user.findUnique({
			where: { id: event.locals.user.id },
			select: { id: true, username: true, email: true, role: true, banned: true },
		});
	}
	return { user: JSON.parse(JSON.stringify(user)) };
};
