import { fail, redirect } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';
import { decodeToken, isTokenValid } from '$lib/tokenParser';

export async function load({ cookies }) {
    const token = cookies.get('token');
    
    if (!token || !isTokenValid(token)) {
        throw redirect(302, '/login');
    }

    const payload = decodeToken(token)!;
    const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
            id: true,
            email: true,
            username: true
        }
    });

    if (!user) {
        throw redirect(302, '/login');
    }

    return {
        user
    };
}

export const actions = {
    changePassword: async ({ cookies, request }) => {
        const token = cookies.get('token');
        
        if (!token || !isTokenValid(token)) {
            return fail(401, {
                error: 'No estás autenticado'
            });
        }

        const payload = decodeToken(token)!;
        const data = await request.formData();
        const currentPassword = data.get('currentPassword') as string;
        const newPassword = data.get('newPassword') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        // Validación básica
        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, {
                error: 'Todos los campos son requeridos'
            });
        }

        if (newPassword.length < 6) {
            return fail(400, {
                error: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, {
                error: 'Las contraseñas nuevas no coinciden'
            });
        }

        try {
            // Buscar usuario
            const user = await prisma.user.findUnique({
                where: { id: payload.userId }
            });

            if (!user) {
                return fail(404, {
                    error: 'Usuario no encontrado'
                });
            }

            // Verificar contraseña actual
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            
            if (!validPassword) {
                return fail(400, {
                    error: 'La contraseña actual es incorrecta'
                });
            }

            // Hash de la nueva contraseña
            const hashedNewPassword = await bcrypt.hash(newPassword, 12);

            // Actualizar contraseña
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: hashedNewPassword
                }
            });

            return {
                success: true,
                message: 'Contraseña actualizada correctamente'
            };

        } catch (error) {
            console.error('Error changing password:', error);
            return fail(500, {
                error: 'Error interno del servidor. Por favor, inténtalo de nuevo.'
            });
        }
    }
};
