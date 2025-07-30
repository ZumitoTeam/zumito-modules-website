import type { RequestHandler } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export async function load({ url }) {
	const selectedFeatures = url.searchParams.get('features')?.split(',') || [];

	const modules = await prisma.module.findMany({
        where: selectedFeatures.length > 0 ? {
            features: {
                some: {
                    name: {
                        in: selectedFeatures
                    }
                }
            }
        } : {},
        orderBy: {
            installs: {
                _count: 'desc'
            }
        },
        take: 10,
        select: {
            id: true,
            name: true,
            shortDescription: true,
            description: true,
            npm: true,
            instructions: true,
            published: true,
            authorId: true,
            icon: true,
            features: {
                select: {
                    name: true
                }
            },
            _count: {
                select: {
                  installs: true, // Get the install count
                },
            },
        }
    })

    const allFeatures = await prisma.feature.findMany();

	// Calcular estadísticas dinámicas
	const [moduleCount, downloadCount, developerCount, featureCount, popularFeatures] = await Promise.all([
		prisma.module.count({
			where: { published: true }
		}),
		prisma.install.count(),
		prisma.module.findMany({
			where: { published: true },
			select: { authorId: true },
			distinct: ['authorId']
		}),
		prisma.feature.count(),
		// Obtener features populares con conteo de módulos
		prisma.feature.findMany({
			select: {
				id: true,
				name: true,
				emoji: true,
				_count: {
					select: {
						modules: true
					}
				}
			},
			orderBy: {
				modules: {
					_count: 'desc'
				}
			},
			take: 6
		})
	]);

	const totalDownloads = downloadCount || 0;
	const uniqueDevelopers = developerCount.length;

	// Formatear estadísticas con emojis
	const stats = [
		{
			label: "Módulos",
			value: moduleCount >= 1000 ? `${Math.floor(moduleCount / 1000)}k+` : `${moduleCount}+`,
			icon: "🚀"
		},
		{
			label: "Descargas",
			value: totalDownloads >= 1000 ? `${Math.floor(totalDownloads / 1000)}k+` : `${totalDownloads}+`,
			icon: "📦"
		},
		{
			label: "Desarrolladores",
			value: uniqueDevelopers >= 1000 ? `${Math.floor(uniqueDevelopers / 1000)}k+` : `${uniqueDevelopers}+`,
			icon: "👨‍💻"
		},
		{
			label: "Características",
			value: featureCount >= 1000 ? `${Math.floor(featureCount / 1000)}k+` : `${featureCount}+`,
			icon: "📋"
		}
	];

	// Mapear features populares con sus emojis de la base de datos
	const featuredFeatures = popularFeatures.map((feature) => ({
		id: feature.id,
		name: feature.name,
		icon: feature.emoji,
		count: feature._count.modules
	}));

    return {
        modules: JSON.parse(JSON.stringify(modules)),
        allFeatures: JSON.parse(JSON.stringify(allFeatures)),
        stats,
        featuredFeatures
    };
}