export interface SubCategories {
    id: string;
    image: String;
    name: string;
    categoryId: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface SubCategoryResponse {
    items: SubCategories[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}