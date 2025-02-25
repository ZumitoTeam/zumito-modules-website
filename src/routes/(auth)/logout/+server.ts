// src/routes/(auth)/logout/+server.ts
// remove token cookie
import { redirect } from '@sveltejs/kit';

export const GET = (async ({ cookies }) => {
    cookies.delete('token', {
      path: '/',
    });
    return redirect(302, '/');
});