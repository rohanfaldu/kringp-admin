export interface State {
    id: string;
    name: string;
    countryId: string;
    status: boolean;
    createsAt: Date;
    updatedAt: Date;
}

export interface StateResponse {
    items: State[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}