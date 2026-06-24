import { getUserById } from '$lib/server/db/users';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	let user: any = null;
	if (event.locals.user) {
		user = await getUserById(event.locals.user.id);
	}
	return { user: JSON.parse(JSON.stringify(user)) };
};
