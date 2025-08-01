import prisma from '$lib/prisma.js';

export const load = async ({ url }) => {
    const searchQuery = url.searchParams.get('search') || '';
    const selectedFeatures = url.searchParams.get('features')?.split(',').filter(Boolean) || [];
    const sortBy = url.searchParams.get('sort') || 'latest';
    const priceFilter = url.searchParams.get('price') || 'all';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = 12;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions: any = {
        published: true,
        aproved: true,
    };

    if (searchQuery) {
        whereConditions.OR = [
            {
                name: {
                    contains: searchQuery,
                    mode: 'insensitive'
                }
            },
            {
                shortDescription: {
                    contains: searchQuery,
                    mode: 'insensitive'
                }
            },
            {
                description: {
                    contains: searchQuery,
                    mode: 'insensitive'
                }
            }
        ];
    }

    if (selectedFeatures.length > 0) {
        whereConditions.features = {
            some: {
                name: {
                    in: selectedFeatures
                }
            }
        };
    }

    if (priceFilter === 'free') {
        whereConditions.price = 0;
    } else if (priceFilter === 'paid') {
        whereConditions.price = {
            gt: 0
        };
    }

    // Build order by conditions
    let orderBy: any = {};
    switch (sortBy) {
        case 'popular':
            orderBy = {
                installs: {
                    _count: 'desc'
                }
            };
            break;
        case 'name':
            orderBy = { name: 'asc' };
            break;
        case 'price-low':
            orderBy = { price: 'asc' };
            break;
        case 'price-high':
            orderBy = { price: 'desc' };
            break;
        default:
            orderBy = { id: 'desc' };
    }

    try {
        const [modules, totalCount, allFeatures, featureStats] = await Promise.all([
            // Get modules with pagination
            prisma.module.findMany({
                where: whereConditions,
                include: {
                    author: {
                        select: {
                            username: true
                        }
                    },
                    features: {
                        select: {
                            name: true,
                            emoji: true
                        }
                    },
                    _count: {
                        select: {
                            installs: true,
                            comments: true
                        }
                    }
                },
                orderBy,
                take: limit,
                skip: offset
            }),
            
            // Get total count for pagination
            prisma.module.count({
                where: whereConditions
            }),
            
            // Get all features
            prisma.feature.findMany({
                select: {
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
                }
            }),

            // Get feature statistics for the current filter
            prisma.feature.findMany({
                select: {
                    name: true,
                    _count: {
                        select: {
                            modules: {
                                where: {
                                    published: true,
                                    aproved: true,
                                    ...(searchQuery && {
                                        OR: [
                                            {
                                                name: {
                                                    contains: searchQuery,
                                                    mode: 'insensitive'
                                                }
                                            },
                                            {
                                                shortDescription: {
                                                    contains: searchQuery,
                                                    mode: 'insensitive'
                                                }
                                            },
                                            {
                                                description: {
                                                    contains: searchQuery,
                                                    mode: 'insensitive'
                                                }
                                            }
                                        ]
                                    }),
                                    ...(priceFilter === 'free' && { price: 0 }),
                                    ...(priceFilter === 'paid' && { price: { gt: 0 } })
                                }
                            }
                        }
                    }
                }
            })
        ]);

        // Serializar campos Decimal (price) a string para SvelteKit
        const safeModules = modules.map((m) => ({
            ...m,
            price: m.price?.toString?.() ?? m.price
        }));

        // Create feature stats object from database results
        const featureStatsObject: Record<string, number> = {};
        featureStats.forEach(feature => {
            featureStatsObject[feature.name] = feature._count.modules;
        });

        const totalPages = Math.ceil(totalCount / limit);

        return {
            modules: safeModules,
            totalCount,
            totalPages,
            currentPage: page,
            searchQuery,
            selectedFeatures,
            sortBy,
            priceFilter,
            allFeatures: JSON.parse(JSON.stringify(allFeatures)),
            featureStats: featureStatsObject
        };
    } catch (error) {
        console.error('Error loading modules:', error);
        return {
            modules: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            searchQuery: '',
            selectedFeatures: [],
            sortBy: 'latest',
            priceFilter: 'all',
            allFeatures: [],
            featureStats: {}
        };
    }
};
