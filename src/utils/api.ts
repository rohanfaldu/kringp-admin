interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

export async function apiCall<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any,
    headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
    const baseUrl = 'https://api.kringp.com/api';
    
    const requestOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        ...(body && { body: JSON.stringify(body) })
    };

    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}