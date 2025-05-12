export interface Country {
    id: string;
    name: string;
    countryCode: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface CountryResponse {
    countries: Country[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}