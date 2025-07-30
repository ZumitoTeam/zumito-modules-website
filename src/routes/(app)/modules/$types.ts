export type PageData = {
    modules: any[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    searchQuery: string;
    category: string;
    sortBy: string;
    priceFilter: string;
    categoryStats: Record<string, number>;
};
