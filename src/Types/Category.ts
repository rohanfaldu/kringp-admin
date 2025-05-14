export interface Categories {
    id: string;
    image: String;
    name: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface CategoriesResponse {
    categories: Categories[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}