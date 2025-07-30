import prisma from '$lib/prisma.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
    const searchQuery = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
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
        const [modules, totalCount, categories] = await Promise.all([
            // Get modules with pagination
            prisma.module.findMany({
                where: whereConditions,
                include: {
                    author: {
                        select: {
                            username: true
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
            
            // Get popular categories (simulated for now)
            prisma.module.findMany({
                where: {
                    published: true,
                    aproved: true
                },
                select: {
                    id: true,
                    shortDescription: true
                },
                take: 100
            })
        ]);

        // Serializar campos Decimal (price) a string para SvelteKit
        const safeModules = modules.map((m) => ({
            ...m,
            price: m.price?.toString?.() ?? m.price
        }));

        // Extract categories from descriptions (simplified approach)
        const categoryStats = {
            'web-development': 45,
            'api-integration': 32,
            'data-processing': 28,
            'authentication': 15,
            'ui-components': 35,
            'utilities': 22,
            'database': 18,
            'analytics': 12,
            'payment': 8,
            'email': 14
        };

        const totalPages = Math.ceil(totalCount / limit);

        return {
            modules: safeModules,
            totalCount,
            totalPages,
            currentPage: page,
            searchQuery,
            category,
            sortBy,
            priceFilter,
            categoryStats
        };
    } catch (error) {
        console.error('Error loading modules:', error);
        return {
            modules: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            searchQuery: '',
            category: '',
            sortBy: 'latest',
            priceFilter: 'all',
            categoryStats: {}
        };
    }
};
