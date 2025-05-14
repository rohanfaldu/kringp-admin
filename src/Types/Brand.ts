export interface Brand {
    id: string;
    name: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface BrandResponse {
    Brands: Brand[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}