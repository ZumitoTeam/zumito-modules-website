import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async (event) => {
    await auth.api.signOut({ headers: event.request.headers });
    redirect(303, '/login');
  },
};
