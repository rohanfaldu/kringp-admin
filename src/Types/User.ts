export interface Business {
    id: string;
    name: string;
    userImage: string;
    emailAddress: string;
    status: boolean;
    createsAt: Date;
}
export interface BusinessUserResponse {
    Users: Business[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface AutUserResponse {
    user: {
        id: string;
        name: string;
        userImage: string;
        emailAddress: string;
        status: boolean;
        createsAt: Date;
        type: string;
    },
    token: string;
}