export interface SubCategory {
    id: string;
    image: String;
    name: string;
    categoryId: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface SubCategoryResponse {
    subCategories: SubCategory[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}