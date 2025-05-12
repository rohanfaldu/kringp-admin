import { ApiResponse } from "../Types/ApiResponse";

export async function FetchData<T>(
    endpoint: string,
    method: string = 'POST',
    body?: any,
    headers: HeadersInit = {}
): Promise<ApiResponse<T>> {
    const baseUrl = 'https://api.kringp.com/api';
    
    const requestOptions: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers
        }
    };

    // Only add body for methods that typically have one
    if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
    console.log(response,"response");
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
}