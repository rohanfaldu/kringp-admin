export interface AppSetting {
    id: string;
    title: string;
    slug: string;
    value: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AppSettingResponse {
    appData: AppSetting[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}