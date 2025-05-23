export interface City {
    id: string;
    name: string;
    stateId: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface CityResponse {
    items: City[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}