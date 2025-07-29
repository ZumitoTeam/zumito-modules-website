import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
export const load = (async ({ cookies }) => {
    cookies.delete('token', {
        path: '/'
    })
    return redirect(304, '/login');
});