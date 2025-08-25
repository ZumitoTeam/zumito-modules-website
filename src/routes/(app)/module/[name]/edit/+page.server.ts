import { error, redirect, json } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { decodeToken, isTokenValid } from '$lib/tokenParser';
import type { Actions } from './$types';
import { minioClient } from '$lib/minio';
import { v4 as uuidv4 } from 'uuid';

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
        select: {
            id: true,
            name: true,
            shortDescription: true,
            description: true,
            npm: true,
            instructions: true,
            published: true,
            aproved: true,
            authorId: true,
            icon: true,
            images: {
                select: {
                    url: true
                }
            },
            features: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                  installs: true,
                },
            }
        }
    });

    const allFeatures = await prisma.feature.findMany();

    if (!module) {
        throw error(404, 'Module not found');
    }

    if (module.authorId !== userId) {
        throw redirect(302, `/module/${module.name}`);
    }

    return {
        module: JSON.parse(JSON.stringify(module)),
        allFeatures: JSON.parse(JSON.stringify(allFeatures))
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
        let iconUrl = inputs.get('iconUrl') as string | null;
        const selectedFeatures = inputs.getAll('features') as string[];
        const removedImages = inputs.getAll('removedImages') as string[];

        // Procesar icono: si hay archivo, subirlo a Minio
        let iconFile = inputs.get('iconFile');
        if (iconFile instanceof File && iconFile.size > 0) {
            const fileExtension = iconFile.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;
            const filePath = `images/${fileName}`;
            const fileBuffer = Buffer.from(await iconFile.arrayBuffer());
            const bucketName = 'zumito-modules';
            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, 'us-east-1');
            }
            await minioClient.putObject(bucketName, filePath, fileBuffer, iconFile.size, { 'Content-Type': iconFile.type });
            // Guardar solo la ruta relativa sin dominio en la base de datos
            iconUrl = `/${bucketName}/${filePath}`;
        }
        // Si no hay iconUrl ni iconFile, no actualizar el campo icon (mantener el existente)

        // Procesar imágenes: pueden venir como imageUrls (string) o como File
        let imageUrls: string[] = [];
        // Primero, las existentes
        const existingImageUrls = inputs.getAll('imageUrls') as string[];
        if (existingImageUrls && existingImageUrls.length > 0) {
            imageUrls.push(...existingImageUrls);
        }
        // Ahora, buscar archivos nuevos
        const imagesFiles: File[] = [];
        for (const entry of inputs.entries()) {
            const [key, value] = entry;
            if (key === 'images' && value instanceof File && value.size > 0) {
                imagesFiles.push(value);
            }
        }
        for (const imgFile of imagesFiles) {
            const fileExtension = imgFile.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;
            const filePath = `images/${fileName}`;
            const fileBuffer = Buffer.from(await imgFile.arrayBuffer());
            const bucketName = 'zumito-modules';
            const bucketExists = await minioClient.bucketExists(bucketName);
            if (!bucketExists) {
                await minioClient.makeBucket(bucketName, 'us-east-1');
            }
            await minioClient.putObject(bucketName, filePath, fileBuffer, imgFile.size, { 'Content-Type': imgFile.type });
            // Guardar solo la ruta relativa sin dominio en la base de datos
            const imgUrl = `/${bucketName}/${filePath}`;
            imageUrls.push(imgUrl);
        }

        const existingModule = await prisma.module.findFirst({
            where: {
                name: {
                    equals: params.name
                }
            },
            include: { images: true }
        });

        if (!existingModule) {
            return { status: 404, error: 'Module not found' };
        }

        if (existingModule.authorId !== userId) {
            return { status: 403, error: 'You are not authorized to edit this module' };
        }

        // Eliminar imágenes de la base de datos (y opcionalmente del storage externo)
        if (removedImages && removedImages.length > 0) {
            await prisma.image.deleteMany({
                where: {
                    url: { in: removedImages },
                    moduleId: existingModule.id
                }
            });
            // Si usas almacenamiento externo (ej. S3/Minio), aquí puedes borrar los archivos físicos
            // por cada url en removedImages
            // Ejemplo:
            // for (const url of removedImages) {
            //   await deleteFromStorage(url);
            // }
        }

        // Actualizar el módulo
        const updateData: any = {
            name,
            shortDescription,
            description,
            npm,
            images: {
                deleteMany: {},
                create: imageUrls.map(url => ({ url }))
            },
            features: {
                set: selectedFeatures.map((name) => ({ name }))
            }
        };

        // Solo actualizar el icono si hay iconUrl (ya sea nueva URL tras subir archivo o URL existente)
        if (iconUrl) {
            updateData.icon = iconUrl;
        }

        await prisma.module.update({
            where: { id: existingModule.id },
            data: updateData
        });

        return { success: true };
    },
}